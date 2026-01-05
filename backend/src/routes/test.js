const express = require('express');
const router = express.Router();
const Merchant = require('../models/Merchant');

router.get('/merchant', async (req, res) => {
    try {
        const merchant = await Merchant.findOne({ where: { email: 'test@example.com' } });
        if (!merchant) {
            // Should not happen if seeded
            return res.status(404).json({ error: { code: 'NOT_FOUND_ERROR', description: 'Test merchant not found' } });
        }

        res.status(200).json({
            id: merchant.id,
            email: merchant.email,
            api_key: merchant.api_key,
            api_secret: merchant.api_secret,
            seeded: true
        });
    } catch (err) {
        res.status(500).json({ error: { code: 'INTERNAL_ERROR', description: err.message } });
    }
});

module.exports = router;
