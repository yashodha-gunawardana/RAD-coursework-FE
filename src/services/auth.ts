import api from "./api";


// register function
export const registerUser = async (fullname: string, email: string, password: string) => {
    const res = await api.post("/auth/register", {fullname, email, password})
    return res.data
}


// login function
export const loginUser = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password })
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
}


// admin get all users (for admin panel)
export const getAllUsers = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
}) => {
    try {
        console.log("Calling getAllUsers with params:", params);

        const res = await api.get("/auth/admin", { params });

        console.log("getAllUsers response:", res.data);
        return res.data;

    } catch (error: any) {
        console.error("getAllUsers error:", error.response?.data || error.message);
        throw error;
    }
}


// admin approve vendor request
export const approveVendorRequest = async (userId: string) => {
    const res = await api.post(`/auth/admin/approve/${userId}`)
    return res.data
}


// admin reject vendor request
export const rejectVendorRequest = async (userId: string) => {
    const res = await api.post(`/auth/admin/reject/${userId}`)
    return res.data
}


// admin delete user
export const deleteUserAccount = async (userId: string) => {
  try {

    const res = await api.delete(`/auth/admin/${userId}`); 
    return res.data;

  } catch (err: any) {
    console.error("Delete user error:", err);
    
   
    const errorMessage = 
      err.response?.data?.message || 
      err.message || 
      "Failed to delete user";

    // Re-throw so frontend can catch and show error toast
    throw new Error(errorMessage);
  }
}


// refresh access token using refresh token
export const refreshTokens = async (refreshToken: string) => {
  const res = await api.post("/auth/refresh", { token: refreshToken })
  return res.data
}