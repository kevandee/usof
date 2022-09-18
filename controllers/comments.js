const comments = new (require('../models/comments'))()
const likes = new (require('../models/likes'))()
const getAbsoluteUrl = require('../utils/getAbsoluteUrl')

module.exports = {
    async getComment(req, res) {
        let commentId = parseInt(req.params.commentId);
        if(isNaN(commentId)) {
            res.sendStatus(400);
            return;
        }
        let comment = await comments.find(commentId);
        if (comment == -1) {
            res.sendStatus(400);
            return;
        }

        res.status(200).json(comment);
    },

    async updateComment(req, res) {
        let commentId = parseInt(req.params.commentId);
        if(isNaN(commentId)) {
            res.sendStatus(400);
            return;
        }
        let comment = await comments.find(commentId);
        if (comment == -1) {
            res.sendStatus(400);
            return;
        }
        if (comment.author.id !== req.user.id) {
            res.sendStatus(403);
            return;
        }

        let resId = await comments.save({id: commentId, ...req.body})
        if (resId == -1) {
            res.sendStatus(400);
            return;
        }

        res.sendStatus(200);
    },

    async deleteComment(req, res) {
        let commentId = parseInt(req.params.commentId);
        if(isNaN(commentId)) {
            res.sendStatus(400);
            return;
        }

        let comment = await comments.find(commentId);
        if (comment == -1) {
            res.sendStatus(400);
            return;
        }
        if (comment.author.id !== req.user.id) {
            res.sendStatus(403);
            return;
        }

        if (!await comments.delete(commentId)) {
            res.sendStatus(400);
            return;
        }

        res.sendStatus(200);
    },

    async getCommentLikes(req, res) {
        let commentId = parseInt(req.params.commentId);
        if(isNaN(commentId)) {
            res.sendStatus(400);
            return;
        }
        let likesList = await likes.getCommentLikes(commentId)

        res.status(200).json(likesList);
    },

    async newCommentLike(req, res) {
        let commentId = parseInt(req.params.commentId);
        if(isNaN(commentId)) {
            res.sendStatus(400);
            return;
        }
        let data = req.body;
        data.comment_id = commentId;
        data.author_id = req.user.id;
        
        let likeId = await likes.save(data);
        if (likeId == -1) {
            res.sendStatus(400);
            return;
        }

        res.sendStatus(200);
    },

    async deleteCommentLike(req, res) {
        let commentId = parseInt(req.params.commentId);
        if(isNaN(commentId)) {
            res.sendStatus(400);
            return;
        }
        let like = await likes.getUserLike({comment_id: commentId, author_id: req.user.id});

        if (!await likes.delete(like.id)) {
            res.sendStatus(400);
            return;
        }
        
        res.sendStatus(200);
    }
}