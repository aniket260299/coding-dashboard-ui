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

