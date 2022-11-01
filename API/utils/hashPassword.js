const salt = require('../config.json').secretSalt
const crypto = require('crypto')

module.exports = (password) => {
    return crypto.pbkdf2Sync(password, salt, 1000, 30, `sha512`).toString(`hex`);
}