import axios from "axios";


const api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  withCredentials: true,
})

const PUBLIC_ENDPOINTS = ["/auth/login", "/auth/register"]

export default api
