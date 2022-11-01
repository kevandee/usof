import axios from "axios";

export default class LikesService {
    static async getLikesInfo(url) {
        try {
            const response = await axios.get('/api' + url + '/like');
            return response;
        } catch (err) {
            console.log(err);
        }
    }

    static async newLike(url, type = 1) {
        try {
            const response = await axios.post('/api' + url + '/like',  {type}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response;
        } catch(err) {
            console.log(err);
        }
    }

    static async deleteLike(url) {
        try {
            const response = await axios.delete('/api' + url + '/like');
            return response;
        } catch(err) {
            console.log(err);
        }
    }
}