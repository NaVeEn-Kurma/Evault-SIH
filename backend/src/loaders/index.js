const config = require('../config');
const { getClient, closeClient } = require('./database');
const express = require('./express');
const Logger = require('./logger');
const Express = require('express');

module.exports = async({ expressApp }) => {
    const databaseClient = await getClient(); // Obtain the database client connection

    try {
        Logger.info(`✌️ Connection to database successful`);

        await express({ app: expressApp });
        Logger.info('✌️ Express loaded');

        Logger.info('✅ All modules loaded!');
    } catch (err) {
        Logger.error(err);
    } finally {
        closeClient(databaseClient); // Close the client connection when the application is done
    }
};