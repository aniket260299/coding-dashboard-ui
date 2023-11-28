import axios from 'axios';

function getUrl() {
    const URL = process.env.REACT_APP_CODING_DASHBOARD_LIVE_URL || "http://localhost:8080";
    return URL + "/api/sheet";
}

function authorizationHeader() {
    return { headers: { Authorization: "Bearer " + localStorage.getItem("jwt-token") } };
}

function getUsername() {
    return localStorage.getItem("username");
}

export function getSheetsByUserName() {
    return axios.get(getUrl() + "/user/" + getUsername(), authorizationHeader());
}

export function addSheet(sheet) {
    return axios.post(getUrl(), sheet, authorizationHeader());
}

export function updateSheet(sheet) {
    return axios.put(getUrl(), sheet, authorizationHeader());
}

export function deleteSheet(id) {
    return axios.delete(getUrl() + "/" + id, authorizationHeader());
}

export function importData(data) {
    return axios.post(getUrl() + "/import/" + getUsername(), data, authorizationHeader());
}

export function exportData() {
    return axios.get(getUrl() + "/export/" + getUsername(), authorizationHeader());
}