const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize } = require('./config/database');
const healthRoutes = require('./routes/health');
const orderRoutes = require('./routes/orders');
const orderPublicRoutes = require('./routes/orders_public');
const paymentRoutes = require('./routes/payments');
const paymentPublicRoutes = require('./routes/payments_public');
const testRoutes = require('./routes/test');
const seedMerchant = require('./utils/seeder');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/health', healthRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/orders', orderPublicRoutes); // Mounts /api/v1/orders/:id/public
app.use('/api/v1/payments', paymentRoutes.router);
app.use('/api/v1/payments', paymentPublicRoutes); // Mounts /api/v1/payments/public
app.use('/api/v1/test', testRoutes);

// Database connection and server start
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected...');

        // Sync models
        await sequelize.sync({ alter: true });

        // Seed test merchant
        await seedMerchant();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Unable to connect to the database:', err);
        process.exit(1);
    }
};

startServer();
