const hashPassword = require('./hashPassword')

const err_codes = {
    OK: 0,
    LOGIN: 1,
    PASSWORD: 2,
    EMAIL: 3
}

function checkEmail(email) {
    return email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/);
}

function validateRegisterData(data) {
    if (!data.login || data.login.length < 5) {
        return err_codes.LOGIN;
    }
    if (!data.password || data.password.length < 8) {
        return err_codes.PASSWORD;
    }
    data.password = hashPassword(data.password);
    if(!data.full_name) {
        data.full_name = data.login;
    }
    if(!data.email || !checkEmail(data.email)) {
        return err_codes.EMAIL;
    }

    return err_codes.OK;
}

module.exports = {err_codes, checkEmail, validateRegisterData}