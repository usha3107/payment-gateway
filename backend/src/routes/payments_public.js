const express = require('express');
const router = express.Router();
const { handleCreatePayment } = require('./payments');

// Create Payment Public
router.post('/public', async (req, res) => {
    await handleCreatePayment(req, res, null);
});

// Get Payment Public (for polling)
router.get('/:id/public', async (req, res) => {
    try {
        const Payment = require('../models/Payment');
        const payment = await Payment.findByPk(req.params.id);

        if (!payment) return res.status(404).json({ error: { code: 'NOT_FOUND_ERROR', description: 'Payment not found' } });

        const response = {
            id: payment.id,
            status: payment.status,
            method: payment.method,
            amount: payment.amount,
            currency: payment.currency
        };
        // Add minimal retry info if needed, but status is key.
        if (payment.status === 'failed') {
            response.error_description = payment.error_description;
        }

        res.status(200).json(response);
    } catch (err) {
        res.status(500).json({ error: { code: 'INTERNAL_ERROR', description: err.message } });
    }
});

module.exports = router;
