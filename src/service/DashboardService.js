import axios from 'axios';

const liveUrl = process.env.REACT_APP_CODING_DASHBOARD_LIVE_URL;
const path = "/api/coding-dashboard"
const CODING_DASHBOARD_URL = liveUrl ? liveUrl + path : "http://localhost:8080" + path;




class DashboardService {
    getConfig(token) {
        return { headers: { Authorization: "Bearer " + token } }
    }

    getAllDashboard(token) {
        return axios.get(CODING_DASHBOARD_URL, this.getConfig(token));
    }

    addDashboard(dashboard, token) {
        return axios.post(CODING_DASHBOARD_URL, dashboard, this.getConfig(token));
    }

    importDashboard(dashboardList, token) {
        return axios.post(CODING_DASHBOARD_URL + '/import', dashboardList, this.getConfig(token));
    }

    getDashboardById(id, token) {
        return axios.get(CODING_DASHBOARD_URL + '/' + id, this.getConfig(token));
    }

    updateDashboard(dashboard, token) {
        return axios.put(CODING_DASHBOARD_URL, dashboard, this.getConfig(token));
    }

    deleteDashboard(id, token) {
        return axios.delete(CODING_DASHBOARD_URL + '/' + id, this.getConfig(token));
    }
}

export default new DashboardService();