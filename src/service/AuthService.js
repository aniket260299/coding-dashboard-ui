import axios from 'axios';
const liveUrl = process.env.REACT_APP_CODING_DASHBOARD_LIVE_URL;
const path = "/api/auth/"
const URL = liveUrl ? liveUrl + path : "http://localhost:8080" + path;

class AuthService {
    signIn = (data) => {
        return axios.post(URL + "sign-in", data);
    }

    signUp = (data) => {
        return axios.post(URL + "sign-up", data);
    }
};

export default new AuthService();