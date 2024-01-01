const { createToken, verifyToken } = require('../../shared/token');
const { getClient, closeClient } = require('../../loaders/database');
const LoggerInstance = require('../../loaders/logger');
const User = require('./model');
const bcrypt = require('bcrypt');
const config = require('../../config');

async function createUser(client) {
    const database = await getClient();

    try {
        console.log('Executing SELECT query...');
        const existingUsers = await database.query('SELECT * FROM users WHERE email = $1', [client.email]);
        console.log('Existing Users:', existingUsers.rows);
        if (existingUsers.rows.length > 0) {
            throw {
                status: 400,
                message: 'User already exists',
            };
        }

        // Hash the password and insert the user into the database
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(client.password, salt);

        const insertedUser = await database.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *', [client.name, client.email, hash]
        );

        return {
            bool: true,
            message: 'Success, User created.',
            status: 200,
            user: insertedUser.rows[0],
        };
    } catch (err) {
        LoggerInstance.error(err);
        return {
            bool: false,
            message: err.message || 'Request Failed',
        };
    } finally {
        closeClient(database);
    }
}


async function loginUser(email, password) {
    try {
        const database = await getClient();
        const results = await database.query(`SELECT * FROM users WHERE email = $1`, [email]);

        if (results.rows.length === 0) {
            throw {
                status: 400,
                message: 'User does not exist, please register first',
            };
        } else {
            if (bcrypt.compareSync(password, results.rows[0].password)) {
                return {
                    message: 'Login Successful',
                    status: 200,
                    accessToken: createToken({ id: results.rows[0].id.toString() }, config.jwtSecret, '1d'),
                    refreshToken: createToken({ id: results.rows[0].id.toString() }, config.jwtSecret, '2d'),
                };
            } else {
                throw {
                    message: 'Password does not match',
                    status: 401,
                };
            }
        }
    } catch (err) {
        LoggerInstance.error(err);
        return {
            message: err.message || 'Request Failed',
            status: err.status || 500,
        };
    }
}

async function getProfile(token) {
    let id;
    try {
        const database = await getClient();
        id = verifyToken(token, config.jwtSecret).id;

        const results = await database.query(`SELECT * FROM users WHERE id = $1`, [id]);
        if (results.rows.length === 0) {
            throw {
                status: 400,
                message: 'User not found!',
            };
        }

        return results.rows[0];
    } catch (e) {
        LoggerInstance.error(e);
        throw {
            message: 'Unauthorized Access',
            status: 401,
        };
    }
}

module.exports = {
    createUser,
    loginUser,
    getProfile,
};