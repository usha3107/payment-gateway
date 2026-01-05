const express = require('express');
const router = express.Router();
const { sequelize } = require('../config/database');

router.get('/', async (req, res) => {
    let dbStatus = 'disconnected';
    try {
        await sequelize.authenticate();
        dbStatus = 'connected';
    } catch (error) {
        dbStatus = 'disconnected';
    }

    // Deliverable 2 requirements check (Redis/Worker). defaulting to hardcoded for D1 as per spec interpretation, 
    // but let's stick to D1 strict req first which says:
    // status: "healthy", database: "connected"

    // Actually, D1 req:
    // { "status": "healthy", "database": "connected", "timestamp": ... }

    // D2 req adds redis/worker. I'll add them if env var suggests D2 or just provide them as static "N/A" or omit if not D2. 
    // The user prompt says "Enhanced Health Check for Deliverable 2 (Required): ... includes Redis and worker status".
    // Since I am building "foundational components... Deliverable 1" effectively, but the prompt lists "Deliverable 2 (Required)",
    // I should probably include them to be safe or maybe just "connected" if I'm not using them?
    // User Prompt says: "For Deliverable 2, the health check endpoint should also include Redis and worker status".
    // I will include them as "connected"/"running" dummy values if not implemented, or check safely.
    // Since I don't have Redis in docker-compose, I should probably check if I need to add it.
    // The docker-compose requirements ONLY listed postgres, api, dashboard, checkout. No redis.
    // So likely this is D1. I will strictly follow D1 first, but maybe add D2 fields as "disconnected" or "not_configured" if I want to be safe?
    // Wait, the prompt says "For Deliverable 2...". I will assume I am doing D1 unless told otherwise.
    // BUT the check says "Enhanced Health Check for Deliverable 2 (Required)". This is ambiguous.
    // It says "For Deliverable 2 (Required): For Deliverable 2...". 
    // I'll stick to the base D1 requirement first: status, database, timestamp.

    res.status(200).json({
        status: 'healthy',
        database: dbStatus,
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
