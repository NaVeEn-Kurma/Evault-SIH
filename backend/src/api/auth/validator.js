const { NextFunction } = require('express');
const LoggerInstance = require('../../loaders/logger');
const { getProfileSchema, loginSchema, signUpSchema } = require('./schema');

async function signUpValidator(req, res, next) {
    try {
        req.body = await signUpSchema.validate(req.body, { stripUnknown: true });
        next();
    } catch (e) {
        LoggerInstance.error(e);
        res.status(422).json({
            message: 'Validation Failed',
            error: e.errors.map((error) => error),
        });
    }
}

async function loginValidator(req, res, next) {
    try {
        req.body = await loginSchema.validate(req.body, { stripUnknown: true });
        console.log('here');
        next();
    } catch (e) {
        LoggerInstance.error(e);
        res.status(422).json({
            message: 'Validation Failed',
            error: e.errors.map((error) => error),
        });
    }
}

async function getProfileValidator(req, res, next) {
    try {
        req.body = await getProfileSchema.validate(req.headers);
        next();
    } catch (e) {
        LoggerInstance.error(e);
        res.status(422).json({
            message: 'Token Required',
            error: e.errors.map((error) => error),
        });
    }
}

module.exports = {
    signUpValidator,
    loginValidator,
    getProfileValidator,
};