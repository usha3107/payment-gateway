const Merchant = require('../models/Merchant');

const authenticateMerchant = async (req, res, next) => {
    const apiKey = req.header('X-Api-Key');
    const apiSecret = req.header('X-Api-Secret');

    if (!apiKey || !apiSecret) {
        return res.status(401).json({
            error: {
                code: 'AUTHENTICATION_ERROR',
                description: 'Invalid API credentials'
            }
        });
    }

    try {
        const merchant = await Merchant.findOne({
            where: {
                api_key: apiKey,
                api_secret: apiSecret
            }
        });

        if (!merchant) {
            return res.status(401).json({
                error: {
                    code: 'AUTHENTICATION_ERROR',
                    description: 'Invalid API credentials'
                }
            });
        }

        req.merchant = merchant;
        next();
    } catch (error) {
        console.error('Auth Error:', error);
        res.status(500).json({
            error: {
                code: 'INTERNAL_SERVER_ERROR',
                description: 'Authentication failed'
            }
        });
    }
};

module.exports = { authenticateMerchant };
