import axios from "axios";


const api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  withCredentials: true,
})

// define endpoints that do NOT require authentication
const PUBLIC_ENDPOINTS = ["/auth/login", "/auth/register"]

api.interceptors.request.use((config) => {
    
})

export default api
