import axios, { AxiosError } from "axios";


const api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  withCredentials: true,
})

// define endpoints that do NOT require authentication
const PUBLIC_ENDPOINTS = ["/auth/login", "/auth/register"]

// request interceptor: run before every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken")

    // check if current request is to a public endpoint
    const isPublic = PUBLIC_ENDPOINTS.some((url) => config.url?.includes(url))

    // if token exists and endpoint is NOT public, add Authorization header
    if (token && !isPublic) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// response interceptor: runs on every response/error
api.interceptors.response.use(
    (Response) => {
        return response
    },

    async (err: AxiosError) => {
        // save original request config
        const originalRequest: any = err.config

        const isPublic = PUBLIC_ENDPOINTS.some((url) => 
            originalRequest.url?.includes(url)
        )
    }
)

export default api
