const Model = require('./model');
const mysql = require('mysql2');
const db = require('./db');

class User extends Model {
    constructor() {
        super('users');
    }

    async find(id) {
        const data = await super.find(id);
        
        if (!data.length) {
            return -1;
        }
        let res = {
            id: data[0].id,
            login: data[0].login,
            password: data[0].password,
            fullName: data[0].full_name,
            email: data[0].email,
            profilePicture: data[0].profile_picture,
            rating: data[0].rating,
            role: data[0].role
        }
        this.data = res;

        return res;
    }

    async check(obj) {
        let sql = 'SELECT * FROM ' + this.table + ' WHERE ';
        let where = [];
        for (let key in obj) {
            where.push(`${key} = \'${obj[key]}\'`);
        }
        sql += where.join(' AND ');
        const connection = db.connect();
        let data = await connection.promise().query(sql);
        if (data[0].length) {
            return data[0][0].id;
        }
        return -1;
    }

    async delete(id) {
        const res = await super.delete(id);
        if(res) {
            this.data = null;
            return true;
        }
        else {
            return false;
        }
    }

    async save(obj) {
        let res = await super.save(obj);
        if (typeof res === 'string') {
            console.error(res.slice(6));
            return -1;
        }
        if (obj.id) {
            res = await this.find(obj.id);
        }
        else {
            await this.find(res);
        }

        return res;
    }

    async getByLogin(login) {
        const sql = 'SELECT * FROM ' + this.table + ' WHERE login=\'' + login + '\'';
        const connection = db.connect();
        const data = await connection.promise().query(sql);
        connection.end();
        
        if (data[0].length) {
            return data[0][0];
        }
        return -1;
    }
    
    async getByEmail(email) {
        const sql = 'SELECT * FROM ' + this.table + ' WHERE email=\'' + email + '\'';
        const connection = db.connect();
        const data = await connection.promise().query(sql);
        connection.end();
        
        if (data[0].length) {
            return data[0][0];
        }
        return -1;
    }

    async selectByIdRange(pageNum, offset) {
        if (pageNum && offset) {
            return await super.selectByIdRange(pageNum * offset - offset, pageNum * offset);
        }

        return await super.selectByIdRange()
    }

    async pagination(pageNum, limit, isAdmin) {
        if (isAdmin) {
            return await super.pagination(["*"],pageNum, limit);
        }
        else {
            return await super.pagination(["id", "login", "full_name", "profile_picture", "rating", "role"], pageNum, limit);
        }
    }
}


module.exports = User;

// let user = new User('users')
// async function bebra(){
//     console.log(await user.sellectAll())
//     console.log(await user.find(2))
// }

// bebra()