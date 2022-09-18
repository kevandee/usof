const {generateConfirmToken, authenticateConfirmToken, generateAccessToken} = require('../utils/token')
const hashPassword = require('../utils/hashPassword')
const {validateRegisterData} = require('../utils/validateAuth')
const user = new (require('../models/user'))()
const sendLetter = require('../utils/nodemailer')
const config = require('../config.json')


module.exports = {
    async register(req, res) {
        let data = req.body;
        let err = validateRegisterData(data);

        if (err) {
            res.sendStatus(400);
            return;
        }
        if (await user.check({login: data.login}) != -1) {
            res.status(409).json({
                status: 409,
                message: "login already exists"
            });
            return;
        }
        if (await user.check({email: data.email}) != -1) {
            res.status(409).json({
                status: 409,
                message: "email already exists"
            });
            return;
        }

        if((!req.user || req.user.role !== 'admin') && data.role === 'admin') {
            res.sendStatus(403);
            return;
        }

        let confirmToken = generateConfirmToken(data);

        let message = `
        Hi,
        Thank you for signing up with usof.
        To complete your account set-up, please verify your email address by clicking on the confirmation link below.
        Confirmation Link:
        http://localhost:${config.port}/api/auth/confirm-email/${confirmToken}
        *** If for any reason the above link is not clickable, please copy the link and paste it in your choice of browser.
        Best regards,
        - Anton Chaika
        `;
        sendLetter(data.email, 'Confirm email', message);

        res.sendStatus(200);
    },

    async login(req, res) {
        let data = req.body;
        data.password = hashPassword(data.password);
        let exists = await user.check(data);
        console.log(exists)
        if (exists == -1) {
            res.sendStatus(401);
            return;
        }
        let userData = await user.getByLogin(data.login);
        const token = generateAccessToken({login: userData.login, id: userData.id, role: userData.role});
        res.cookie("token", token);
        res.sendStatus(200);
    },

    logout(req, res) {
        if (!req.cookies.token) {
            res.sendStatus(401);
            return
        }
        res.clearCookie('token');
        res.sendStatus(204);
    },

    async passwordReset(req, res) {
        let data = req.body;
        if (!data.email) {
            res.sendStatus(400);
            return;
        }
        if (await user.check({email: data.email}) == -1) {
            res.sendStatus(404);
            return;
        }

        let confirmToken = generateConfirmToken({email: data.email});

        let message = `
        Hi,
        Thank you for signing up with usof.
        To complete your account set-up, please verify your email address by clicking on the confirmation link below.
        Confirmation Post URL:
        http://localhost:${config.port}/api/auth/password-reset/${confirmToken}
        *** If for any reason the above link is not clickable, please copy the link and paste it in your choice of browser.
        Best regards,
        - Anton Chaika
        `;
        sendLetter(data.email, 'Confirm email', message);

        res.sendStatus(200);
    },

    async confirmPassword(req, res) {
        let token = req.params.confirmToken;
        let data = authenticateConfirmToken(token)
        if (!token || !data) {
            res.sendStatus(403);
            return;
        }
        delete data.iat;
        delete data.exp;

        if(await user.save(data) == -1) {
            res.sendStatus(400);
            return
        }
        res.sendStatus(200);
    },

    async confirmNewPassword(req, res) {
        let newPassword = req.body.newPassword;
        if (!newPassword || newPassword.length < 8) {
            res.sendStatus(400);
            return;
        }
        
        let token = req.params.confirmToken;
        let data = authenticateConfirmToken(token)
        if (!token || !data) {
            res.sendStatus(400);
            return;
        }
        let userData = await user.getByEmail(data.email);
        
        userData.password = hashPassword(newPassword);
        if(await user.save(data) == -1) {
            res.sendStatus(400);
            return
        }
        res.sendStatus(200);
    }
}