const { Router } = require('express');
const LoggerInstance = require('../../loaders/logger');
const { createUser, getProfile, loginUser } = require('./controller');
const { getProfileValidator, loginValidator, signUpValidator } = require('./validator');

const authRouter = Router();

async function handleSignUp(req, res) {
    try {
        const result = await createUser(req.body);
        if (result.bool) {
            res.status(201).json({
                message: 'Success',
            });
        } else {
            throw {
                status: 400,
                message: result.message,
            };
        }
    } catch (e) {
        console.log(e);
        LoggerInstance.error(e);
        res.status(e.status || 500).json({
            message: e.message || 'Request Failed',
        });
    }
}

async function handleLogin(req, res) {
    try {
        const result = await loginUser(req.body.email, req.body.password);
        res.status(result.status).json({
            message: result.message,
            accessToken: result.accessToken || '',
            refreshToken: result.refreshToken || '',
        });
    } catch (e) {
        LoggerInstance.error(e);
        res.status(e.status || 500).json({
            message: e.message || 'Request Failed',
        });
    }
}

async function handleGetProfile(req, res) {
    try {
        const token = req.headers.authorization;
        LoggerInstance.info(token);
        const user = await getProfile(token.substring(7, token.length));
        res.status(200).json({
            message: 'Success',
            data: user,
        });
    } catch (e) {
        LoggerInstance.error(e);
        res.status(e.status || 500).json({
            message: e.message || 'Request Failed',
        });
    }
}

authRouter.post('/signUp', signUpValidator, handleSignUp);
authRouter.post('/login', loginValidator, handleLogin);
authRouter.get('/getProfile', getProfileValidator, handleGetProfile);

module.exports = authRouter;