import axios from "axios";

export default class AuthService {
    static async login(loginData) {
        try {
            const response = await axios.post("/api/auth/login", loginData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response;
        } catch (err) {
            return err;
        }
    }

    static async logout() {
        try {
            const response = await axios.post("/api/auth/logout", null);
            return response;
        } catch (err) {
            console.log(err);
        }
    }

    static async register(registerData) {
        const response = await axios.post("/api/auth/register", registerData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response;
    }
}