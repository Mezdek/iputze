import axios from "axios";

export const api = axios.create({
    baseURL: "/api",
    withCredentials: true, // important for cookies
    headers: {
        "Content-Type": "application/json",
    },
});