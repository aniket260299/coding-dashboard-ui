import axios from 'axios';

const CODING_DASHBOARD_URL = "http://localhost:8080/api/coding-dashboard";

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