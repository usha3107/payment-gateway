const express = require('express');
const router = express.Router();
const { authenticateMerchant } = require('../middlewares/auth');
const Order = require('../models/Order');

// Create Order
router.post('/', authenticateMerchant, async (req, res) => {
    try {
        const { amount, currency, receipt, notes } = req.body;

        // Validation
        if (!amount || !Number.isInteger(amount) || amount < 100) {
            return res.status(400).json({
                error: {
                    code: 'BAD_REQUEST_ERROR',
                    description: 'amount must be at least 100'
                }
            });
        }

        // Generate Order ID
        const generateOrderId = () => {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = 'order_';
            for (let i = 0; i < 16; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        };

        let orderId = generateOrderId();
        // Simple collision check (in prod, use loop with retry)
        let exists = await Order.findByPk(orderId);
        while (exists) {
            orderId = generateOrderId();
            exists = await Order.findByPk(orderId);
        }

        const order = await Order.create({
            id: orderId,
            merchant_id: req.merchant.id,
            amount,
            currency: currency || 'INR',
            receipt,
            notes,
            status: 'created'
        });

        res.status(201).json({
            id: order.id,
            merchant_id: order.merchant_id,
            amount: order.amount,
            currency: order.currency,
            receipt: order.receipt,
            notes: order.notes,
            status: order.status,
            created_at: order.created_at
        });

    } catch (error) {
        console.error('Create Order Error:', error);
        res.status(500).json({ error: { code: 'INTERNAL_ERROR', description: error.message } });
    }
});

// Get Order
router.get('/:id', authenticateMerchant, async (req, res) => { // Auth Required for merchant facing API? Usually yes.
    // The spec implementation details for GET /api/v1/orders/{order_id} shows Headers with API Key/Secret.
    // But Checkout page needs public access? "Alternative: Make the existing endpoints accept optional authentication... or Public Endpoints".
    // I will implement "Alternative" logic here or separate logic.
    // Spec says: "GET /api/v1/orders/{order_id} ... Headers: X-Api-Key...".
    // AND "Checkout Page API Authentication... Public Endpoints (Recommended)... GET /api/v1/orders/{order_id}/public"
    // I will implement the authenticated one here. The public one can be added separately or by logic.
    // Let's implement the standard authenticated one first.

    try {
        const order = await Order.findOne({
            where: {
                id: req.params.id,
                merchant_id: req.merchant.id
            }
        });

        if (!order) {
            return res.status(404).json({
                error: {
                    code: 'NOT_FOUND_ERROR',
                    description: 'Order not found'
                }
            });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: { code: 'INTERNAL_ERROR', description: error.message } });
    }
});

module.exports = router;
