const Model = require('./model');
const db = require('./db');

const postsLikes = new (require('./relation'))('posts_likes')
const commentsLikes = new (require('./relation'))('comments_likes')
const user = new (require('./user'))()

module.exports = class Likes extends Model {
    constructor() {
        super('likes')
    }

    async find(id) {
        let data = await super.find(id);
        if (!data.length) {
            return -1;
        }

        let author = await user.find(data[0].author_id)
        let res = {
            id: data[0].id,
            author: {
                id: author.id,
                login: author.login,
                fullName: author.fullName,
                profilePicture: author.profilePicture,
                rating: author.rating,
                role: author.role
            },
            publishDate: data[0].publish_date,
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
        let like = {};
        if (obj.post_id) {
            like.post_id = obj.post_id;
            delete obj.post_id;
        }
        else if(obj.comment_id) {
            like.comment_id = obj.comment_id;
            delete obj.comment_id;
        }
        else {
            return -1;
        } 
        
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
            like.like_id = res;
            if (like.post_id) {
                await postsLikes.save(like)
            }
            else {
                await commentsLikes.save(like)
            }
        }

        return res;
    }
    
    async selectByIdRange(pageNum, offset) {
        if (pageNum && offset) {
            return await super.selectByIdRange((pageNum - 1) * offset + 1, pageNum * offset);
        }

        return await super.selectByIdRange()
    }

    async getPostLikes(postId) {
        const connection = db.connect();
        let sql = `SELECT likes.*, users.login, users.full_name, users.profile_picture, users.rating, users.role FROM likes LEFT JOIN posts_likes ON likes.id = posts_likes.like_id LEFT JOIN users ON users.id = likes.author_id WHERE posts_likes.post_id = ${postId};`
        let likes = (await connection.promise().query(sql))[0];
        connection.end();

        let res = []
        for (let like of likes) {
            res.push({
                id: like.id,
                publishDate: like.publish_date,
                type: like.type,
                author: {
                    id: like.author_id,
                    login: like.login,
                    fullName: like.full_name,
                    profilePicture: like.profile_picture,
                    rating: like.rating,
                    role: like.role
                }
            })
        }

        return res;
    }

    async getCommentLikes(commentId) {
        const connection = db.connect();
        let sql = `SELECT likes.*, users.login, users.full_name, users.profile_picture, users.rating, users.role FROM likes LEFT JOIN comments_likes ON likes.id = comments_likes.like_id LEFT JOIN users ON users.id = likes.author_id WHERE comments_likes.comment_id = ${commentId};`
        let likes = (await connection.promise().query(sql))[0];
        connection.end();

        let res = []
        for (let like of likes) {
            res.push({
                id: like.id,
                publishDate: like.publish_date,
                type: like.type,
                author: {
                    id: like.author_id,
                    login: like.login,
                    fullName: like.full_name,
                    profilePicture: like.profile_picture,
                    rating: like.rating,
                    role: like.role
                }
            })
        }

        return res;
    }

    async getUserLike(obj) {
        const connection = db.connect();
        let pre;
        if (obj.post_id) {
            pre = "post";
        }
        else if(obj.comment_id) {
            pre = "comment";
        }
        else {
            return -1;
        }
        let sql = `SELECT likes.* FROM likes LEFT JOIN ${pre}s_likes ON likes.id = ${pre}s_likes.like_id WHERE ${pre}s_likes.${pre}_id = ${obj.post_id ?? obj.comment_id} AND likes.author_id = ${obj.author_id};`
        let res = (await connection.promise().query(sql))[0];
        connection.end();

        if (!res.length) {
            return -1;
        }

        return res[0];
    }
}
