const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Order = require('./Order');
const Merchant = require('./Merchant');

const Payment = sequelize.define('Payment', {
    id: {
        type: DataTypes.STRING(64),
        primaryKey: true
    },
    order_id: {
        type: DataTypes.STRING(64),
        allowNull: false,
        references: {
            model: Order,
            key: 'id'
        }
    },
    merchant_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Merchant,
            key: 'id'
        }
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    currency: {
        type: DataTypes.STRING(3),
        defaultValue: 'INR'
    },
    method: {
        type: DataTypes.STRING(20),
        allowNull: false, // "upi" or "card"
        validate: {
            isIn: [['upi', 'card']]
        }
    },
    status: {
        type: DataTypes.STRING(20),
        defaultValue: 'created' // Spec says created, but immediately 'processing'
    },
    vpa: {
        type: DataTypes.STRING,
        allowNull: true
    },
    card_network: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    card_last4: {
        type: DataTypes.STRING(4),
        allowNull: true
    },
    error_code: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    error_description: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'payments',
    underscored: true,
    timestamps: true,
    indexes: [
        { fields: ['order_id'] },
        { fields: ['status'] }
    ]
});

// Relationships
Order.hasMany(Payment, { foreignKey: 'order_id' });
Payment.belongsTo(Order, { foreignKey: 'order_id' });
Merchant.hasMany(Payment, { foreignKey: 'merchant_id' });
Payment.belongsTo(Merchant, { foreignKey: 'merchant_id' });

module.exports = Payment;
