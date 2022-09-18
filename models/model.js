const mysql = require('mysql2');
const db = require('./db');

module.exports = class {
    constructor(table) {
        this.table = table;
    }
    
    async find(id) {
        const sql = 'SELECT * FROM ' + this.table + ' WHERE id = ' + id + ';';
        const connection = db.connect();
        const data = await connection.promise().query(sql);
        connection.end();
        return data[0];
    }

    async exists(obj) {
        const sql = 'SELECT * FROM ' + this.table + ' WHERE ' + obj.name + ' = \'' + obj.value + '\';';
        const connection = db.connect();
        const data = await connection.promise().query(sql);
        connection.end();
        if (data[0].length) {
            return true;
        }
        else {
            return false;
        }
    }

    async delete(id) {
        if (this.find(id).length === 0) {
            return false;
        }
        const sql = 'DELETE FROM ' + this.table + ' WHERE id = ' + id + ';';
        const connection = db.connect();
        let res = await connection.promise().query(sql);
        connection.end();
        if(res[0].affectedRows) {
            return true;
        }
        else {
            return false;
        }
    }

    async save(obj) {
        const pairs = Object.entries(obj);
        let sql;
        if (obj.id) {
            let u_values = '';
            for (let i = 0; i < pairs.length; i++) {
                if(pairs[i][0] === 'id') {
                    continue;
                }
                u_values += pairs[i][0] + '=' + '\'' +pairs[i][1] + '\'';
    
                if (i != pairs.length - 1) {
                    u_values += ', ';
                }
            }
            sql = `UPDATE ${this.table} SET ${u_values} WHERE id = ` + obj.id + ';';
        }
        else {
            let i_values = '';
            let i_keys = '';
            for (let i = 0; i < pairs.length; i++) {
                if(pairs[i][0] === 'id') {
                    continue;
                }
                i_values +=  '\'' + pairs[i][1] + '\'';
                i_keys += pairs[i][0];
    
                if (i != pairs.length - 1) {
                    i_values += ', ';
                    i_keys += ', ';
                }
            }
            sql = `INSERT INTO ${this.table} (${i_keys}) VALUES (${i_values});`;
        }
        const connection = db.connect();
        let res = await connection.promise().query(sql).catch((reason) => {
            let mes = reason.sqlMessage;
            mes = mes.slice(mes.indexOf(' for key \'') + 10, mes.lastIndexOf('\''));
            return mes;
        });
        connection.end();
        if (typeof res === 'string') {
            return res;
        }
        if (!obj.id){
            return res[0].insertId;
        }
        else {
            return res[0].affectedRows;
        }
    }

    async selectByIdRange(fromId, toId) {
        let sql = 'SELECT * FROM ' + this.table;
        if(fromId >= 0) {
            sql += ` WHERE id>=${fromId}`
            if (toId) {
                sql += ` AND id<=${toId}`
            }
        }
        const connection = db.connect();
        const data = await connection.promise().query(sql);
        connection.end();
        
        return data[0];
    }

    async pagination(cols, pageNum, limit, sqlFilter) {
        limit = limit ?? 10;
        cols = cols.join(',');    
        const sql = `SELECT ${cols} FROM ${this.table} ${sqlFilter ?? ' '} LIMIT ${limit} OFFSET ${(pageNum - 1)*limit}`
        const connection = db.connect();
        const data = await connection.promise().query(sql);
        connection.end();
        
        return data[0];
    }
}