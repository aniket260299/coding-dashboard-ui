import axios from 'axios';

const liveUrl = process.env.REACT_APP_CODING_DASHBOARD_LIVE_URL || "http://localhost:8080";
const URL = liveUrl + "/api/sheet";
const token = localStorage.getItem("jwt-token");
const username = localStorage.getItem("username");

export default class SheetService {

    authorizationHeader() {
        return { headers: { Authorization: "Bearer " + token } };
    }

    getSheetsByUserName() {
        return axios.get(URL + "/user/" + username, this.authorizationHeader());
    }

    addSheet(sheet) {
        return axios.post(URL, sheet, this.authorizationHeader());
    }

    updateSheet(sheet) {
        return axios.put(URL, sheet, this.authorizationHeader());
    }

    deleteSheet(id) {
        return axios.delete(URL + "/" + id, this.authorizationHeader());
    }
}