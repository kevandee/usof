const Model = require('./model');
const mysql = require('mysql2');
const db = require('./db');

module.exports = class Category extends Model {
    constructor() {
        super('categories');
    }

    async find(id) {
        const data = await super.find(id);
        if (!data.length) {
            return -1;
        }
        let res = {
            id: data[0].id,
            title: data[0].title,
            description: data[0].description
        }
        this.data = res;
        
        return res;
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
            return res.slice(6);
        }
        if (obj.id) {
            res = await this.find(obj.id);
        }
        else {
            await this.find(res);
        }

        return res;
    }

    async getPostCategories(postId) {
        const connection = db.connect();
        let sql = `SELECT categories.* FROM categories LEFT JOIN posts_categories ON categories.id = posts_categories.category_id WHERE posts_categories.post_id = ${postId};`
        let categories = await connection.promise().query(sql);
        connection.end();

        if (!categories.length) {
            return -1;
        }
        categories = categories[0];

        return categories;
    }

    async removePostCategories(postId) {
        const connection = db.connect();
        let sql = `DELETE FROM posts_categories WHERE post_id = ${postId};`
        let res = await connection.promise().query(sql);
        connection.end();

        if(res[0].affectedRows) {
            return true;
        }
        else {
            return false;
        }
    }

    async pagination(pageNum, limit) {
        return await super.pagination(["*"], pageNum, limit);
    }
}