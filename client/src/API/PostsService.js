import axios from "axios";

export default class PostsService {
    static async getPosts(page = 1, offset = 10) {
        try {
            const response = await axios.get("/api/posts", {params: {page: page, offset: offset}});
            console.log(response.data);
            return response;
        } catch (err) {
            console.log(err);
        }
    }

    static async getPost(id) {
        try {
            const response = await axios.get("/api/posts/" + id);
            return response;
        } catch(err) {
            console.log(err);
        }
    }

    static async newPost(postData) {
        try {
            const response = await axios.post("/api/posts", postData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response;
        } catch (err) {
            console.log(err);
        }
    }

    static async getUserPosts(userId = 0, page = 1, offset = 10) {
        try {
            const response = await axios.get("/api/posts", {params: {page: page, offset: offset, filter: {author_id: userId}}});
            return response;
        } catch (err) {
            console.log(err);
        }
    }

    static async getPostCategories(postId) {
        try {
            const response = await axios.get(`/api/posts/${postId}/categories`)
            return response;
        } catch(err) {
            console.log(err);
        }
    }

    static async getAllCategories() {
        try {
            const response = await axios.get(`/api/categories`)
            return response;
        } catch(err) {
            console.log(err);
        }
    }

    static async getPostComments(postId) {
        try {
            const response = await axios.get(`/api/posts/${postId}/comments`)
            return response;
        } catch(err) {
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