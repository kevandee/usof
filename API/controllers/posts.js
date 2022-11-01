const posts = new (require('../models/posts'))()
const comments = new (require('../models/comments'))()
const categories = new (require('../models/categories'))()
const likes = new (require('../models/likes'))()
const getAbsoluteUrl = require('../utils/getAbsoluteUrl')
const getDate = require('../utils/getDate');

module.exports = {
    async getPostsList(req, res) {
        // console.log(req.query)
        const url = getAbsoluteUrl(req);
        const pageNum = req.query.page ?? 1;
        const limit = req.query.limit ?? 10;
        let responseData = {
            total: await posts.count(),
            list : await posts.parseFilterPagination(pageNum, limit, req.query),
            links: {
                next: `${url}?page=${pageNum + 1}&limit=${limit}`,
                self: `${url}?page=${pageNum}&limit=${limit}`
            }
        }
        // console.log("bebra", responseData.total);
        res.status(200).json(responseData);
    },

    async newPost(req, res) {
        let author_id = req.user.id;
        let data = req.body;
        let postId = await posts.save({
            author_id: author_id,
            title: data.title,
            publish_date:  getDate(),
            content: data.content
        })
        if (postId == -1) {
            res.sendStatus(400);
            return;
        }

        for(let categoryId of data.categories) {
            if(await posts.addPostCategory(postId, categoryId) == -1) {
                await posts.delete(postId);
                res.status(400).json({error: "unknown category: " + categoryId});
                return;
            }
        }

        res.status(200).json({post_id: postId});
    },

    async getPost(req, res) {
        let postId = parseInt(req.params.postId);
        if(isNaN(postId)) {
            res.sendStatus(400);
            return;
        }
        let post = await posts.find(postId);

        res.status(200).json(post);
    },

    async updatePost(req, res) {
        let postId = parseInt(req.params.postId);
        if(isNaN(postId) || req.body.author_id) {
            res.sendStatus(400);
            return;
        }
        let post = await posts.find(postId);
        if (req.user.id != post.author.id) {
            res.sendStatus(403);
            return;
        }

        let data = {id: postId};
        if (req.body.title) {
            data.title = req.body.title;
        }
        if(req.body.content) {
            data.contents = req.body.content;
        }
        if (req.body.content || req.body.title) {
            const id = await posts.save(data);
            if (id == -1) {
                res.sendStatus(400);
                return;
            }
        }
        if (req.body.categories) {
            await categories.removePostCategories(postId);
            for(let categoryId of req.body.categories) {
                if(await posts.addPostCategory(postId, categoryId) == -1) {
                    res.status(400).json({error: "unknown category: " + categoryId});
                    return;
                }
            }
        }

        res.sendStatus(200);
    },

    async deletePost(req, res) {
        let postId = parseInt(req.params.postId);
        if(isNaN(postId)) {
            res.sendStatus(400);
            return;
        }
        let post = await posts.find(postId);
        if (req.user.id != post.author.id && req.user.role !== 'admin') {
            res.sendStatus(403);
            return;
        }

        if (!await posts.delete(postId)) {
            res.sendStatus(400);
            return;
        }
        
        res.sendStatus(200);
    },

    async getPostComments(req, res) {
        let postId = parseInt(req.params.postId);
        if(isNaN(postId)) {
            res.sendStatus(400);
            return;
        }
        let commentsList = await comments.getPostComments(postId);

        res.status(200).json(commentsList);
    },

    async newPostComment(req, res) {
        let postId = parseInt(req.params.postId);
        if(isNaN(postId)) {
            res.sendStatus(400);
            return;
        }
        let data = req.body;
        data.post_id = postId;
        data.author_id = req.user.id;
        data.publish_date = getDate();

        let commentId = await comments.save(data);
        if (commentId == -1) {
            res.sendStatus(400);
            return;
        }

        res.sendStatus(200);
    },

    async getPostCategories(req, res) {
        let postId = parseInt(req.params.postId);
        if(isNaN(postId)) {
            res.sendStatus(400);
            return;
        }
        let categoriesList = await categories.getPostCategories(postId);

        res.status(200).json(categoriesList);
    },

    async getPostLikes(req, res) {
        let postId = parseInt(req.params.postId);
        if(isNaN(postId)) {
            res.sendStatus(400);
            return;
        }
        let resData = {};
        if (req.query.list) {
            resData.list = await likes.getPostLikes(postId);
        }

        resData.count = (await likes.getLikesCount({post_id: postId}));
        resData.count = resData.count == -1 ? {likes:0, dislikes: 0, total: 0} : resData.count;
        resData.UserLike = await likes.getUserLike({post_id: postId, author_id: req.user.id});

        res.status(200).json(resData);
    },

    async newPostLike(req, res) {
        let postId = parseInt(req.params.postId);
        if(isNaN(postId)) {
            res.sendStatus(400);
            return;
        }
        let data = req.body;
        data.post_id = req.params.postId;
        data.author_id = req.user.id;
        data.publish_date = getDate();
        if (!data.type) {
            data.type = 0;
        }
        let likeId = await likes.save(data);
        if (likeId == -1) {
            res.sendStatus(400);
            return;
        }

        res.sendStatus(200);
    },

    async deletePostLike(req, res) {
        let postId = parseInt(req.params.postId);
        if(isNaN(postId)) {
            res.sendStatus(400);
            return;
        }
        let like = await likes.getUserLike({post_id: postId, author_id: req.user.id});

        if (!await likes.delete(like.id)) {
            res.sendStatus(400);
            return;
        }
        
        res.sendStatus(200);
    },

    async isPostLiked(req, res) {
        let postId = parseInt(req.params.postId);
        if(isNaN(postId)) {
            res.sendStatus(400);
            return;
        }
        let like = await likes.getUserLike({post_id: postId, author_id: req.user.id});
        if (like) {
            res.json({isLiked: true});
            return;
        }
        res.json({isLiked: false});
    }
}

