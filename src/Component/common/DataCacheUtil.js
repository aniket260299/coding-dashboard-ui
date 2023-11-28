import { authenticated } from "./Utils";

export function setSessionStorage(key, value) {
    if (authenticated()) {
        sessionStorage.setItem(key, JSON.stringify(value));
    }
}

export function updateSessionStorage(key, value) {
    if (sessionStorage.getItem(key)) {
        setSessionStorage(key, value);
    }
}

export function getSessionStorage(key) {
    if (authenticated() && sessionStorage.getItem(key)) {
        return JSON.parse(sessionStorage.getItem(key));
    } else {
        return undefined;
    }
}