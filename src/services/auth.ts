// This allows us to send HTTP requests to the backend easily
import api from "./api";

// defines the shape of data the frontend sends to the backend when registering
type RegisterDataType = {
    fullname: string
    email: string
    password: string
    // address?: string
    // phone?: string
    role: string
}

// register function
export const registerUser = async (data: RegisterDataType) => {
    const res = await api.post("/auth/register", data)
    // return only the response data to the called function
    return res.data
}

// login function
export const loginUser = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password })
    // returns backend response (token, user info, etc.)
    return res.data
}

// get my details function
export const getMyDetails = async () => {
  const res = await api.get("/auth/me")
  return res.data
}

// refresh access token using refresh token
export const refreshTokens = async (refreshToken: string) => {
  const res = await api.post("/auth/refresh", { token: refreshToken })
  // return the response data, which contains the new access token
  return res.data
}