import api from "./api";


// create vendor (admin)
export const createVendor = async (data: FormData) => {
    const res = await api.post("/vendors", data, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
    return res.data
}


// get all vendors (public)
export const getAllVendors = async (params: {
    page?: number,
    limit?: number,
    search?: string,
    category?: string,
    isAvailable?: boolean
} =  {}) => {
    const res = await api.get(`/vendors`, { params })
        return res.data
}


// get vendor by id (public)
export const getvendorById = async (id: string) => {
    const res = await api.get(`/vendors/${id}`)
    return res.data.data
}


export const getVendorByUserId = async () => {
    try {
        // Remove the leading slash since baseURL already includes /api/v1
        const response = await api.get("/vendors/by-user");
        return response.data.data;
    } catch (err: any) {
        return null;
    }
};


// update vendor (admin)
export const updateVendor = async (id: string, data: FormData) => {
    try {
    const res = await api.put(`/vendors/${id}`, data, {
      headers: { 
        "Content-Type": "multipart/form-data" 
      }
    })
    return res.data;

  } catch (err: any) {
    console.error("Failed to update event:", err);
    throw err;
  }
}


export const getAllVendorsForSelect = async () => {
    const res = await api.get("/vendors/dropdown")
    return res.data
}


// delete vendor (admin)
export const deleteVendor = async (id: string) => {
    const res = await api.delete(`/vendors/${id}`)
    return res.data
}

// update own vendor profile (vendor)
export const updateOwnVendorProfile = async (data: FormData) => {
    try {
        const res = await api.put("/vendors/me", data, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
        return res.data

    } catch (err: any) {
        console.error("Failed to update own vendor profile:", err)
        throw err
    }
}

// get own vendor profile (vendor)
export const getOwnVendorProfile = async () => {
    try {
        const res = await api.get("/vendors/me")
        return res.data

    } catch (err: any) {
        console.error("Failed to fetch own vendor profile:", err)
        throw err
    }
}
