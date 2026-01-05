const Merchant = require('../models/Merchant');

const seedMerchant = async () => {
    try {
        const testMerchant = {
            id: '550e8400-e29b-41d4-a716-446655440000',
            name: 'Test Merchant',
            email: 'test@example.com',
            api_key: 'key_test_abc123',
            api_secret: 'secret_test_xyz789'
        };

        // Check if exists using email (unique constraint)
        const existing = await Merchant.findOne({ where: { email: testMerchant.email } });
        if (!existing) {
            await Merchant.create(testMerchant);
            console.log('Test merchant seeded.');
        } else {
            console.log('Test merchant already exists.');
        }
    } catch (error) {
        console.error('Error seeding merchant:', error);
    }
};

module.exports = seedMerchant;
