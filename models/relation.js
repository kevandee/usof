const Model = require('./model');
const mysql = require('mysql2');
const db = require('./db');

module.exports = class Relationships extends Model {
    constructor(relationshipsTable) {
        super(relationshipsTable);
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
            return res;
        }
        if (obj.id) {
            res = await this.find(obj.id);
        }
        else {
            return true
        }

        return false;
    }
}