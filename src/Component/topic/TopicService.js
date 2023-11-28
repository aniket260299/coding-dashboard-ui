import axios from 'axios';

function getUrl() {
    const URL = process.env.REACT_APP_CODING_DASHBOARD_LIVE_URL || "http://localhost:8080";
    return URL + "/api/topic";
}

function authorizationHeader() {
    return { headers: { Authorization: "Bearer " + localStorage.getItem("jwt-token") } };
}

export function getTopicsBySheetId(sheetId) {
    return axios.get(getUrl() + "/sheet/" + sheetId, authorizationHeader());
}

export function addTopic(topic) {
    return axios.post(getUrl(), topic, authorizationHeader());
}

export function updateTopic(topic) {
    return axios.put(getUrl(), topic, authorizationHeader());
}

export function deleteTopic(id) {
    return axios.delete(getUrl() + "/" + id, authorizationHeader());
}