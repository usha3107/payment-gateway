const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Get Order Public
router.get('/:id/public', async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);

        if (!order) {
            return res.status(404).json({
                error: {
                    code: 'NOT_FOUND_ERROR',
                    description: 'Order not found'
                }
            });
        }

        // Return limited info
        res.status(200).json({
            id: order.id,
            amount: order.amount,
            currency: order.currency,
            status: order.status
        });
    } catch (error) {
        res.status(500).json({ error: { code: 'INTERNAL_ERROR', description: error.message } });
    }
});

module.exports = router;
