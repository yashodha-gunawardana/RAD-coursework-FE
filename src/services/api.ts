import axios from "axios";


const api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  withCredentials: true,
})

// define endpoints that do NOT require authentication
const PUBLIC_ENDPOINTS = ["/auth/login", "/auth/register"]

// request interceptor run before every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken")

    // check if current request is to a public endpoint
    const isPublic = PUBLIC_ENDPOINTS.some((url) => config.url?.includes(url))

    // if token exists and endpoint is NOT public, add Authorization header
    if (token && !isPublic) {
        config.headers.Authorization = `Bearer ${token}`
    }
})

export default api
