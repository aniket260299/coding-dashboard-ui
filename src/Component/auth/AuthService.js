import axios from 'axios';

function liveURL() {
    return process.env.REACT_APP_CODING_DASHBOARD_LIVE_URL || "http://localhost:8080"
}
function getUrl() {
    return liveURL() + "/api/auth/";
}

export function signIn(data) {
    return axios.post(getUrl() + "sign-in", data);
}

export function signUp(data) {
    return axios.post(getUrl() + "sign-up", data);
}

export function isBackendAlive() {
    return axios.get(liveURL());
}