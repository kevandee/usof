const Model = require('./model');
const db = require('./db');

const posts_categories = new (require('./relation'))('posts_categories')

module.exports = class Posts extends Model {
    constructor() {
        super('posts');
    }

    async find(id) {
        let sql = `select posts.*, users.login, users.full_name, users.profile_picture, users.rating, users.role from posts left join users on posts.author_id = users.id WHERE posts.id = ${id};`
        const connection = db.connect();
        const data = (await connection.promise().query(sql))[0];

        connection.end();
        if (!data.length) {
            return -1;
        }

        let res = {
            id: data[0].id,
            author: {
                id: data[0].author_id,
                login: data[0].login,
                fullName: data[0].full_name,
                profilePicture: data[0].profile_picture,
                rating: data[0].rating,
                role: data[0].role
            },
            title: data[0].title,
            status: data[0].status,
            content: data[0].content,
            publish_date: data[0].publish_date
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
        delete obj.categories 
        let res = await super.save(obj);
        if (typeof res === 'string') {
            console.error(res);
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
    
    async addPostCategory(postId, categoryId) {
        let res = await posts_categories.save({post_id: postId, category_id: categoryId});
        if (typeof res === 'string') {
            console.error(res);
            return -1;
        }
        await this.find(res);  

        return res;
    }

    async selectByIdRange(pageNum, offset) {
        if (pageNum && offset) {
            return await super.selectByIdRange((pageNum - 1) * offset + 1, pageNum * offset);
        }

        return await super.selectByIdRange()
    }

    async count() {
        let sql = `select count(*) as total from ${this.table};`
        const connection = db.connect();
        const data = (await connection.promise().query(sql))[0];

        connection.end();

        return data[0].total;
    }

    async pagination(pageNum, limit, sql) {
        if (sql) {
            return await super.pagination(["posts.*"], pageNum, limit, sql);
        }
        sql = `left join posts_likes pl on posts.id = pl.post_id group by (posts.id) order by(likes) desc`
        return (await super.pagination(["posts.*", "count(pl.post_id) as likes"], pageNum, limit, sql));
    }

    async parseFilterPagination(pageNum, limit, query) {
        if (!query || (!query.sort && !query.filter)) {
            return await this.pagination(pageNum, limit)
        }
        let sort = query.sort;
        let filter = query.filter;
        let sql = '';
        let where = [];
        let group = `group by (posts.id)`;
        let order = '';
        let columns = ["posts.*"];
        
        if (sort) {
            if (sort.likes) {
                if (sort.likes.toLowerCase() != 'asc' && sort.likes.toLowerCase() != 'desc') {
                    return -1
                }
                sql = `left join posts_likes pl on posts.id = pl.post_id`;
                group = `group by (posts.id)`;
                order = `order by(likes) ${sort.likes}`;
                columns.push("count(pl.post_id) as likes");
            }
            else if(sort.date) {
                if (sort.date.toLowerCase() != 'asc' && sort.date.toLowerCase() != 'desc') {
                    return -1
                }
                order=`order by(publish_date) ${sort.date}`
            }
        }
        else {
            sql = `left join posts_likes pl on posts.id = pl.post_id`
            order = `order by(likes) desc`;
            columns.push("count(pl.post_id) as likes");
        }

        if(filter) {
            if(filter.categories) {
                let categoriesNum = filter.categories.split(',');
                sql += ` left join posts_categories pc on posts.id = pc.post_id `
                let arr = [];
                for (let category of categoriesNum) {
                    category = Number(category);
                    if (isNaN(category)) {
                        return -1;
                    }
                    arr.push(`sum(pc.category_id = ${category})`);
                }
                group += ' having ' + arr.join(' AND ');
            }
            if(filter.status) {
                where.push(`posts.status = \'${filter.status}\'`)
            }
            if(filter.date) {
                if(filter.date.from) {
                    let date = filter.date.from;
                    if (!checkDate(date)) {
                        return -1;
                    }
                    date = Date.parse(date);
                    where.push(`posts.publish_date >= \'${date}\'`)
                }
                if(filter.date.to) {
                    let date = filter.date.to;
                    if (!checkDate(date)) {
                        return -1;
                    }
                    date = Date.parse(date);
                    where.push(`posts.publish_date < \'${date}\'`)
                }
            }
            if(filter.author_id) {
                where.push(`posts.author_id = ${filter.author_id}`);
            }
        }
        if (where.length) {
            where = 'where ' + where.join(' AND ');
        } 
        sql = `${sql} ${where} ${group} ${order}`;
        return await super.pagination(columns, pageNum, limit, sql);
    }
}

function checkDate(date) {
    return date.match(/^\d{4}-\d{2}-\d{2}[T/\s]\d{2}:\d{2}:\d{2}/gm)
}
