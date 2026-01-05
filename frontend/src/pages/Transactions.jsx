import { useEffect, useState } from 'react';
import axios from 'axios';

const Transactions = () => {
    const [payments, setPayments] = useState([]);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                // Assuming we use the test merchant for now as stored in localStorage or hardcoded
                // In a real app we would use authentication
                // For this deliverable, we use the test merchant credentials from the "Login" (which we know are fixed)
                // We'll fetch the merchant details again or store them better.
                // For simplicity, I'll just fetch test merchant credentials again to make the call.
                const authRes = await axios.get('http://localhost:8000/api/v1/test/merchant');
                const { api_key, api_secret } = authRes.data;

                const res = await axios.get('http://localhost:8000/api/v1/payments', {
                    headers: {
                        'X-Api-Key': api_key,
                        'X-Api-Secret': api_secret
                    }
                });
                setPayments(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchPayments();
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h2>Transactions</h2>
            <table data-test-id="transactions-table" style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
                        <th style={{ padding: '12px' }}>Payment ID</th>
                        <th style={{ padding: '12px' }}>Order ID</th>
                        <th style={{ padding: '12px' }}>Amount</th>
                        <th style={{ padding: '12px' }}>Method</th>
                        <th style={{ padding: '12px' }}>Status</th>
                        <th style={{ padding: '12px' }}>Created</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.map(payment => (
                        <tr key={payment.id} data-test-id="transaction-row" data-payment-id={payment.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '12px' }} data-test-id="payment-id">{payment.id}</td>
                            <td style={{ padding: '12px' }} data-test-id="order-id">{payment.order_id}</td>
                            <td style={{ padding: '12px' }} data-test-id="amount">{payment.amount}</td>
                            <td style={{ padding: '12px' }} data-test-id="method">{payment.method}</td>
                            <td style={{ padding: '12px' }} data-test-id="status">{payment.status}</td>
                            <td style={{ padding: '12px' }} data-test-id="created-at">{new Date(payment.created_at).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Transactions;
