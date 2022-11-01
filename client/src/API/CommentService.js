import axios from "axios";

export default class CommentService {
    static async newPostComment(postId, content) {
        try {
            const response = await axios.post(`/api/posts/${postId}/comments`, {content}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response;
        } catch (err) {
            console.log(err);
        }
    }
    
    static async newCommentComment(parentId, content) {
        try {
            const response = await axios.post(`/api/comments/${parentId}/comments`, {content}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response;
        } catch (err) {
            console.log(err);
        }
    }

    static async getCommentData(commentId) {
        try {
            const response = await axios.get(`/api/comments/${commentId}/comments`)
            return response;
        } catch(err) {
            console.log(err);
        }
    }
}