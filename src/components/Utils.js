import AuthService from "../service/AuthService";
import DashboardService from "../service/DashboardService";

class Utils {
    authenticated = () => {
        if (localStorage.getItem("jwt-token")) {
            const now = new Date();
            const expiry = new Date(Number(localStorage.getItem("jwt-token-expiry")));
            if (expiry > now) return true;
        }
        localStorage.clear();
        return false;
    };

    fetchDashboardList = async () => {
        const isAlive = await this.isAlive();
        if (this.authenticated() && isAlive) {
            const response = await DashboardService.getAllDashboard(localStorage.getItem("jwt-token"));
            if (response?.data) {
                localStorage.setItem("dashboardList", JSON.stringify(response.data));
                return response.data;
            }
        }
    }

    findIndexFromId = (id, list) => {
        for (let i = 0; i < list.length; i++) {
            if (list[i].id === id) {
                return i;
            }
        }
        return 0;
    }

    isAlive = async () => {
        const response = await AuthService.isAlive();
        return response?.data || false;
    }

    getRevisionNotes = () => {
        const today = new Date();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();
        const date = today.getDate();
        return 'Revision Dates: ' + date + "/" + month + "/" + year + '\nLast Revision Notes:';
    };

    getTags = () => {
        if (this.authenticated()) {
            let list = localStorage.getItem("dashboardList");
            if (list) {
                list = JSON.parse(list);
                const idx = list.length - 1;
                if (idx >= 0) {
                    const tags = list[idx].tags.split(',');
                    if (tags.length === 3 && !isNaN(tags[2])) {
                        tags[2] = Number(tags[2]) + 1;
                        return tags.join(',');
                    }
                }
            }
        }
        return '';
    };
}

export default new Utils();

