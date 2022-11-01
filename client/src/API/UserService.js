import axios from "axios";

export default class UserService {
    static async getUserInfo(id) {
        try {
            const response = await axios.get("/api/users/" + id);
            return response;
        } catch (err) {
            console.log(err);
        }
    }

    static async updateUserInfo(userData, id) {
        try {
            const response = await axios.patch("/api/users/" + id, userData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response;
        } catch (err) {
            console.log(err);
        }
    }

    static async uploadAvatar(formData) {
        try {
            const response = await axios.post("/api/users/avatar", formData, {
                headers: {
                    'Content-Type': "multipart/form-data"
                }
            });
            return response;
        } catch (err) {
            console.log(err);
        }
    }
}