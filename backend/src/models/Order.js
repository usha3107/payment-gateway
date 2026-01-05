const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Merchant = require('./Merchant');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.STRING(64),
        primaryKey: true
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
        type: DataTypes.INTEGER, // Smallest currency unit
        allowNull: false,
        validate: {
            min: 100
        }
    },
    currency: {
        type: DataTypes.STRING(3),
        defaultValue: 'INR'
    },
    receipt: {
        type: DataTypes.STRING,
        allowNull: true
    },
    notes: {
        type: DataTypes.JSONB, // Use JSONB for Postgres
        allowNull: true
    },
    status: {
        type: DataTypes.STRING(20),
        defaultValue: 'created'
    }
}, {
    tableName: 'orders',
    underscored: true,
    timestamps: true,
    indexes: [
        {
            fields: ['merchant_id']
        }
    ]
});

// Relationships
Merchant.hasMany(Order, { foreignKey: 'merchant_id' });
Order.belongsTo(Merchant, { foreignKey: 'merchant_id' });

module.exports = Order;
