import axios from 'axios';

function getUrl() {
    const URL = process.env.REACT_APP_CODING_DASHBOARD_LIVE_URL || "http://localhost:8080";
    return URL + "/api/problem";
}

function authorizationHeader() {
    return { headers: { Authorization: "Bearer " + localStorage.getItem("jwt-token") } };
}

export function getProblemById(id) {
    return axios.get(getUrl() + "/" + id, authorizationHeader());
}

export function getProblemsByTopicId(topicId) {
    return axios.get(getUrl() + "/topic/" + topicId, authorizationHeader());
}

export function addProblem(problem) {
    return axios.post(getUrl(), problem, authorizationHeader());
}

export function updateProblem(problem) {
    return axios.put(getUrl(), problem, authorizationHeader());
}

export function deleteProblem(id) {
    return axios.delete(getUrl() + "/" + id, authorizationHeader());
}