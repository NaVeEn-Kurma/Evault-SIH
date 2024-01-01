const jwt = require('jsonwebtoken');

function createToken(data, secret, time) {
    return jwt.sign(data, secret, { expiresIn: time });
}

function verifyToken(token, secret) {
    return jwt.verify(token, secret);
}

module.exports = {
    createToken,
    verifyToken,
};