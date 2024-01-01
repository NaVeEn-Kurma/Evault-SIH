const express = require('express');
const authRouter = require('./auth/router');

module.exports = () => {
    const app = express.Router();

    // TODO: add routes here...
    app.use('/auth', authRouter);

    return app;
};