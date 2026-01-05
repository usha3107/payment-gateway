import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const Checkout = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('order_id');

    const [order, setOrder] = useState(null);
    const [method, setMethod] = useState(null); // 'upi' or 'card'
    const [step, setStep] = useState('summary'); // 'summary', 'processing', 'success', 'error'
    const [paymentId, setPaymentId] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');

    // Form States
    const [vpa, setVpa] = useState('');
    const [cardData, setCardData] = useState({
        number: '',
        expiry: '', // MM/YY
        cvv: '',
        holder_name: ''
    });

    useEffect(() => {
        if (orderId) {
            fetchOrder();
        }
    }, [orderId]);

    const fetchOrder = async () => {
        try {
            // Use public endpoint
            const res = await axios.get(`http://localhost:8000/api/v1/orders/${orderId}/public`);
            setOrder(res.data);
        } catch (err) {
            console.error(err);
            setErrorMsg("Invalid Order ID");
            setStep('error');
        }
    };

    const handleCreatePayment = async (e) => {
        e.preventDefault();
        setStep('processing');

        try {
            const payload = {
                order_id: orderId,
                method: method
            };

            if (method === 'upi') {
                payload.vpa = vpa;
            } else {
                const [month, year] = cardData.expiry.split('/');
                payload.card = {
                    number: cardData.number,
                    expiry_month: month,
                    expiry_year: year,
                    cvv: cardData.cvv,
                    holder_name: cardData.holder_name
                };
            }

            // POST to /public endpoint
            const res = await axios.post('http://localhost:8000/api/v1/payments/public', payload);

            const pId = res.data.id;
            setPaymentId(pId);

            // Spec says: "Poll ... every 2 seconds". 
            // My API handles synchronous wait, so res.data should ALREADY be success/failed.
            // But if I want to be safe or if I changed logic to async later, I should check status.
            if (res.data.status === 'processing') {
                // Start polling
                pollStatus(pId);
            } else if (res.data.status === 'success') {
                setStep('success');
            } else {
                // Failed
                setStep('error');
                setErrorMsg(res.data.error_description || "Payment Failed");
            }

        } catch (err) {
            console.error(err);
            setStep('error');
            setErrorMsg(err.response?.data?.error?.description || "Payment processing failed");
        }
    };

    const pollStatus = (pid) => {
        const interval = setInterval(async () => {
            try {
                // Use Public or Auth? Spec didn't specify Public GET Payment. 
                // "Poll /api/v1/payments/{payment_id}".
                // If I made it auth only, Checkout page can't poll without auth!
                // I need to make GET /payments/:id public OR accessible if I know the ID.
                // The prompt says "Poll ...", and earlier "Checkout Page API Authentication ... Public Endpoints ... GET order ... POST payment".
                // It didn't explicitly say GET payment public.
                // But logically it must be.
                // Wait, "Poll /api/v1/payments/{payment_id} every 2 seconds to check status".
                // I should probably allow public access to payment status if they have the ID?
                // ID is random string, effectively a capability token.
                // I will assume GET /api/v1/payments/:id allows access if I didn't enforce auth there. 
                // In my backend implementation of GET /:id, I used `authenticateMerchant`. So it IS protected.
                // This will fail for checkout page.
                // I must fix Backend to allow Public Access or "Optional Auth" for GET Payment.
                // I'll fix this in next step.

                // For now, let's write the poll logic.
                const res = await axios.get(`http://localhost:8000/api/v1/payments/${pid}/public`);
                // Wait I didn't make a /public route for GET Payment yet. I made it for POST.
                // I'll assume I'll add it or modify existing.

                if (res.data.status === 'success') {
                    clearInterval(interval);
                    setStep('success');
                } else if (res.data.status === 'failed') {
                    clearInterval(interval);
                    setStep('error');
                    setErrorMsg("Payment Failed");
                }
            } catch (e) {
                clearInterval(interval); setStep('error');
            }
        }, 2000);
    };

    if (!orderId) return <div>No Order ID provided</div>;
    if (!order && step !== 'error') return <div>Loading Order...</div>;

    return (
        <div data-test-id="checkout-container" style={{ background: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', width: '400px' }}>

            {/* Order Summary */}
            {(step === 'summary' || step === 'processing') && (
                <div data-test-id="order-summary" style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                    <h2 style={{ marginTop: 0 }}>Complete Payment</h2>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <span>Amount: </span>
                        <span data-test-id="order-amount" style={{ fontWeight: 'bold' }}>₹{order?.amount / 100}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Order ID: </span>
                        <span data-test-id="order-id" style={{ color: '#777' }}>{order?.id}</span>
                    </div>
                </div>
            )}

            {/* Payment Method Selection */}
            {step === 'summary' && !method && (
                <div data-test-id="payment-methods" style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                    <button data-test-id="method-upi" data-method="upi" onClick={() => setMethod('upi')}>
                        Pay via UPI
                    </button>
                    <button data-test-id="method-card" data-method="card" onClick={() => setMethod('card')}>
                        Pay via Card
                    </button>
                </div>
            )}

            {/* UPI Form */}
            {step === 'summary' && method === 'upi' && (
                <form data-test-id="upi-form" onSubmit={handleCreatePayment} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <h3 style={{ margin: '0 0 10px' }}>UPI Payment</h3>
                    <input
                        data-test-id="vpa-input"
                        placeholder="username@bank"
                        type="text"
                        value={vpa}
                        onChange={e => setVpa(e.target.value)}
                        required
                    />
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button type="button" onClick={() => setMethod(null)} style={{ background: '#95a5a6' }}>Back</button>
                        <button data-test-id="pay-button" type="submit" style={{ flex: 1 }}>
                            Pay ₹{order?.amount / 100}
                        </button>
                    </div>
                </form>
            )}

            {/* Card Form */}
            {step === 'summary' && method === 'card' && (
                <form data-test-id="card-form" onSubmit={handleCreatePayment} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <h3 style={{ margin: '0 0 10px' }}>Card Payment</h3>
                    <input
                        data-test-id="card-number-input"
                        placeholder="Card Number"
                        type="text"
                        value={cardData.number}
                        onChange={e => setCardData({ ...cardData, number: e.target.value })}
                        required
                    />
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                            data-test-id="expiry-input"
                            placeholder="MM/YY"
                            type="text"
                            value={cardData.expiry}
                            onChange={e => setCardData({ ...cardData, expiry: e.target.value })}
                            required
                        />
                        <input
                            data-test-id="cvv-input"
                            placeholder="CVV"
                            type="text"
                            value={cardData.cvv}
                            onChange={e => setCardData({ ...cardData, cvv: e.target.value })}
                            required
                        />
                    </div>
                    <input
                        data-test-id="cardholder-name-input"
                        placeholder="Name on Card"
                        type="text"
                        value={cardData.holder_name}
                        onChange={e => setCardData({ ...cardData, holder_name: e.target.value })}
                        required
                    />
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button type="button" onClick={() => setMethod(null)} style={{ background: '#95a5a6' }}>Back</button>
                        <button data-test-id="pay-button" type="submit" style={{ flex: 1 }}>
                            Pay ₹{order?.amount / 100}
                        </button>
                    </div>
                </form>
            )}

            {/* Processing State */}
            {step === 'processing' && (
                <div data-test-id="processing-state" style={{ textAlign: 'center', padding: '20px' }}>
                    <div className="spinner"></div>
                    <span data-test-id="processing-message">Processing payment...</span>
                </div>
            )}

            {/* Success State */}
            {step === 'success' && (
                <div data-test-id="success-state" style={{ textAlign: 'center', color: '#27ae60' }}>
                    <h2>Payment Successful!</h2>
                    <div style={{ marginBottom: '20px' }}>
                        <span>Payment ID: </span>
                        <span data-test-id="payment-id">{paymentId}</span>
                    </div>
                    <div style={{ fontSize: '60px', marginBottom: '20px' }}>✓</div>
                    <span data-test-id="success-message">Your payment has been processed successfully</span>
                </div>
            )}

            {/* Error State */}
            {step === 'error' && (
                <div data-test-id="error-state" style={{ textAlign: 'center', color: '#c0392b' }}>
                    <h2>Payment Failed</h2>
                    <div style={{ fontSize: '60px', marginBottom: '20px' }}>✗</div>
                    <span data-test-id="error-message" style={{ display: 'block', marginBottom: '20px' }}>
                        {errorMsg || "Payment could not be processed"}
                    </span>
                    <button data-test-id="retry-button" onClick={() => { setStep('summary'); setMethod(null); }}>
                        Try Again
                    </button>
                </div>
            )}

        </div>
    );
};

export default Checkout;
