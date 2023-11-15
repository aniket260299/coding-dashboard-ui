import axios from 'axios';
const liveUrl = process.env.REACT_APP_CODING_DASHBOARD_LIVE_URL || "http://localhost:8080";
const path = "/api/auth/"
const URL = liveUrl + path;

class AuthService {
    signIn = (data) => {
        return axios.post(URL + "sign-in", data);
    }

    signUp = (data) => {
        return axios.post(URL + "sign-up", data);
    }

    isAlive = () => {
        return axios.get(liveUrl);
    }
};

export default new AuthService();