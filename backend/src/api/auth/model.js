// User.js
/**
 * @typedef {Object} User
 * @property {string} name - User's name
 * @property {string} email - User's email
 * @property {string} password - User's password
 */

/**
 * @typedef {Object} LoginResponse
 * @property {string} message - Response message
 * @property {number} status - Response status code
 * @property {string} [accessToken] - Optional access token
 * @property {string} [refreshToken] - Optional refresh token
 */

/**
 * @type {User}
 */
const User = {};

module.exports = User;
