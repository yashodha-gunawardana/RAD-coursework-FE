// This allows us to send HTTP requests to the backend easily
import api from "./api";

// defines the shape of data the frontend sends to the backend when registering
/*type RegisterDataType = {
    fullname: string
    email: string
    password: string
    // address?: string
    // phone?: string
    role: string
}*/

// register function
export const registerUser = async (fullname: string, email: string, password: string) => {
    const res = await api.post("/auth/register", {fullname, email, password})
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

// request to become a vendor
export const requestVendor = async () => {
    const res = await api.post("/auth/request/vendor")
    return res.data
};

// admin get all users (for admin panel)
export const getAllUsers = async () => {
    const res = await api.get("/auth/users")
    return res.data
}

// admin approve vendor request
export const approveVendorRequest = async (userId: string) => {
    const res = await api.post(`/auth/users/approve/${userId}`)
    return res.data
}

// admin reject vendor request
export const rejectVendorRequest = async (userId: string) => {
    const res = await api.post(`/auth/users/reject/${userId}`)
    return res.data
}

// admin delete user
// admin delete user
export const deleteUserAccount = async (userId: string) => {
  try {
    const res = await api.delete(`/auth/users/${userId}`); // ← Removed /auth
    return res.data;
  } catch (err: any) {
    console.error("Delete user error:", err);
    
    // Extract server message if available
    const errorMessage = 
      err.response?.data?.message || 
      err.message || 
      "Failed to delete user";

    // Re-throw so frontend can catch and show error toast
    throw new Error(errorMessage);
  }
};

// refresh access token using refresh token
export const refreshTokens = async (refreshToken: string) => {
  const res = await api.post("/auth/refresh", { token: refreshToken })
  // return the response data, which contains the new access token
  return res.data
}