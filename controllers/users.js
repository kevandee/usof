let users = new (require('../models/user'))();
let getAbsoluteUrl = require("../utils/getAbsoluteUrl");
const {validateRegisterData} = require('../utils/validateAuth');
const hashPassword = require('../utils/hashPassword');
const Resize = require('../utils/resize');
const path = require('path');

module.exports = {
    async getUsersList(req, res) {
        const url = getAbsoluteUrl(req);
        const pageNum = req.query.page ?? 1;
        const limit = req.query.limit ?? 10;

        let isAdmin = false;
        if (req.user?.role == 'admin') {
            isAdmin = true;
        }

        let list = await users.pagination(pageNum, limit, isAdmin);
        let responseData = {
            list : list,
            links: {
                next: `${url}?page=${pageNum + 1}&limit=${limit}`,
                self: `${url}?page=${pageNum}&limit=${limit}`
            }
        }

        res.status(200).json(responseData);
    },

    async getUser(req, res) {
        let userId = parseInt(req.params.userId);
        if(isNaN(userId)) {
            res.sendStatus(400);
            return;
        }
        let user = await users.find(userId);
        if (req.user?.role != 'admin') {
            delete user.email;
            delete user.password;
        }
        res.status(200).json(user);
    },

    async newUser(req, res) {
        if (req.user.role !== 'admin') {
            res.sendStatus(403);
            return;
        }
        let data = req.body;
        let err = validateRegisterData(data);

        if (err) {
            res.sendStatus(400);
            return;
        }
        if (await users.check({login: data.login}) != -1) {
            res.status(409).json({
                status: 409,
                message: "login already exists"
            });
            return;
        }
        if (await users.check({email: data.email}) != -1) {
            res.status(409).json({
                status: 409,
                message: "email already exists"
            });
            return;
        }
        if(await users.save(data) == -1) {
            res.sendStatus(400);
            return
        }
        res.sendStatus(200);
    },

    async setUserAvatar(req, res) {
        const user = req.user;
        const imagePath = path.join(__dirname, '../user_files/profile_pictures');
        const fileUpload = new Resize(imagePath);
        if (!req.file) {
            res.status(401).json({error: 'Please provide an image'});
        }
        await fileUpload.save(req.file.buffer, user.login + '.png');
        await users.save({id: user.id, profile_picture: 'profile_pictures/' + user.login + '.png'})
        return res.sendStatus(200);
    },

    async setUserData(req, res) {
        let userId = parseInt(req.params.userId);
        if(isNaN(userId)
        || (req.user.id != userId && req.user.role != 'admin')) {
            res.sendStatus(400);
            return;
        }

        let data = req.body;
        if (data.id 
        ||  data.login
        || (data.rating && req.user.role !== 'admin')
        || data.role == 'admin') {
            res.sendStatus(400);
            return;
        }
        if (data.password) {
            if (data.password.length < 8) {
                res.sendStatus(400);
                return;
            }
            data.password = hashPassword(data.password);
        }

        const id = await users.save({id: userId, ...data});
        if (id == -1) {
            res.sendStatus(400);
            return;
        }

        res.sendStatus(200);
    },

    async deleteUser(req, res) {
        let userId = parseInt(req.params.userId);
        if(isNaN(userId)
        || (req.user.id != userId && req.user.role != 'admin')) {
            res.sendStatus(400);
            return;
        }
        if (!await users.delete(userId)) {
            res.sendStatus(400);
            return;
        }
        
        res.sendStatus(200);
    }
}