const Model = require('./model');
const mysql = require('mysql2');
const db = require('./db');

const user = new (require('./user'))()
const postsComments = new (require('./relation'))('posts_comments')
const commentsComments = new (require('./relation'))('comments_comments')

module.exports = class Comments extends Model {
    constructor() {
        super('comments')
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
        let post_id = null;
        let comment_id = null;
        if (obj.post_id) {
            post_id = obj.post_id;
            delete obj.post_id;
        }
        else if(obj.comment_id) {
            comment_id = obj.comment_id;
            delete obj.comment_id;
        }
        
        let res = await super.save(obj);
        if (typeof res === 'string') {
            return res;
        }
        if (obj.id) {
            res = await this.find(obj.id);
        }
        else {
            await this.find(res);
            if (post_id) {
                await postsComments.save({post_id: post_id, comment_id: res})
            }
            else {
                await commentsComments.save({parent_comment_id: comment_id, comment_id: res})
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

    async getPostComments(postId) {
        const connection = db.connect();
        let sql = `SELECT comments.*, users.login, users.full_name, users.profile_picture, users.rating, users.role FROM comments LEFT JOIN posts_comments ON comments.id = posts_comments.comment_id LEFT JOIN users ON users.id = comments.author_id WHERE posts_comments.post_id = ${postId};`
        let comments = (await connection.promise().query(sql))[0];
        connection.end();

        let res = []
        for (let comment of comments) {
            res.push({
                id: comment.id,
                publishDate: comment.publish_date,
                content: comment.content,
                author: {
                    id: comment.author_id,
                    login: comment.login,
                    fullName: comment.full_name,
                    profilePicture: comment.profile_picture,
                    rating: comment.rating,
                    role: comment.role
                }
            })
        }

        return res;
    }

    async getCommentsComments(commentId) {
        const connection = db.connect();
        let sql = `SELECT comments.*, users.login, users.full_name, users.profile_picture, users.rating, users.role FROM comments LEFT JOIN comments_comments ON comments.id = comments_comments.comment_id LEFT JOIN users ON users.id = comments.author_id WHERE comments_comments.parent_comment_id = ${commentId};`
        let comments = (await connection.promise().query(sql))[0];
        connection.end();

        let res = []
        for (let comment of comments) {
            res.push({
                id: comment.id,
                publishDate: comment.publish_date,
                content: comment.content,
                author: {
                    id: comment.author_id,
                    login: comment.login,
                    fullName: comment.full_name,
                    profilePicture: comment.profile_picture,
                    rating: comment.rating,
                    role: comment.role
                }
            })
        }

        return res;
    }
}
