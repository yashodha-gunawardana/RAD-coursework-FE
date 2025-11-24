// This allows us to send HTTP requests to the backend easily
import api from "./api";

// defines the shape of data the frontend sends to the backend when registering
type RegisterDataType = {
    fullname: string
    email: string
    password: string
    address?: string
    phone?: string
}

// register function
export const registerUser = async (data: RegisterDataType) => {
    const res = await api.post("/auth/register", data)
    // return only the response data to the called function
    return res.data
}

// login function
export const loginUser = async (email: string, password: string) => {
    
}