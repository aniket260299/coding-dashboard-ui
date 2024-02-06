import { isBackendAlive } from "../auth/AuthService";

export function authenticated() {
    if (localStorage.getItem("jwt-token")) {
        const now = new Date();
        const expiry = new Date(Number(localStorage.getItem("jwt-token-expiry")));
        if (expiry > now) {
            return true;
        }
    }
    localStorage.clear();
    return false;
}

export function isAlive() {
    return isBackendAlive();
}


export function findIndexFromId(id, list) {
    for (let i = 0; i < list.length; i++) {
        if (list[i].id === id) {
            return i;
        }
    }
    return 0;
}

export function getRevisionNotes() {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const date = today.getDate();
    return 'Revision Dates: ' + date + "/" + month + "/" + year + '\nLast Revision Notes:';
};

export function getNextPosition(list) {
    let next = 0;
    for (let i = 0; i < list.length; i++) {
        if (list[i].position > next) next = list[i].position;
    }
    return next + 1;
};

export function encodeEscapeCharaters(str) {
    return str.replaceAll('/', '~bslash~');
};

export function decodeEscapeCharaters(str) {
    return str.replaceAll('~bslash~', '/');
};

