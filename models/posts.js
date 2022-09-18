const Model = require('./model');
const db = require('./db');

const posts_categories = new (require('./relation'))('posts_categories')

module.exports = class Posts extends Model {
    constructor() {
        super('posts');
    }

    async find(id) {
        let sql = `select posts.*, users.login, users.full_name, users.profile_picture, users.rating, users.role from posts right join users on posts.author_id = users.id WHERE posts.id = ${id};`
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
            content: data[0].content
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

    async pagination(pageNum, limit, sql) {
        return await super.pagination(["posts.*"], pageNum, limit, sql);
    }
}

// let posts = new Posts()
// async function post() {
//     let res = await posts.save({
//         author_id: 1,
//         title: "test post 1",
//         content: "content of test post",
//         categories: [1, 3]
//     });
//     console.log(await posts.find(res))
//     console.log("select all", await posts.selectByIdRange())
//     console.log("select page 1", await posts.selectByIdRange(1, 2))
//     console.log("select page 2", await posts.selectByIdRange(2, 2))
// }
// post()