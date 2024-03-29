const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const config = require('../config');
const routes = require('../api');

module.exports = ({ app }) => {
    /**
     * Health Check endpoints
     */
    app.get('/healthcheck', (req, res) => {
        const healthcheck = {
            uptime: process.uptime(),
            message: 'OK',
            timestamp: Date.now(),
        };
        try {
            return res.json(healthcheck);
        } catch (e) {
            return res.status(503).send();
        }
    });

    // It shows the real origin IP in the Heroku or Cloudwatch logs
    app.enable('trust proxy');

    // Middleware that helps secure the app by setting headers
    app.use(helmet());

    // Enable Cross-Origin Resource Sharing to all origins by default
    app.use(cors());

    // Middleware that transforms the raw string of req.body into JSON
    app.use(bodyParser.json());

    // Load API routes
    app.use(config.api.prefix, routes());
};