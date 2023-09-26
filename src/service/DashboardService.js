import axios from 'axios';

const liveUrl = process.env.CODING_DASHBOARD_LIVE_URL;
const path = "/api/coding-dashboard"
const CODING_DASHBOARD_URL = liveUrl ? liveUrl + path : "http://localhost:8080" + path;


class DashboardService {

    getAllDashboard() {
        return axios.get(CODING_DASHBOARD_URL);
    }

    addDashboard(dashboard) {
        return axios.post(CODING_DASHBOARD_URL, dashboard);
    }

    getDashboardById(id) {
        return axios.get(CODING_DASHBOARD_URL + '/' + id);
    }

    updateDashboard(dashboard, id) {
        return axios.put(CODING_DASHBOARD_URL, dashboard);
    }

    deleteDashboard(id) {
        return axios.delete(CODING_DASHBOARD_URL + '/' + id);
    }
}

export default new DashboardService();