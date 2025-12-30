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
export const getAllVendors = async () => {
    const res = await api.get("/vendors")
    return res.data
}

// get vendor by id (public)
export const getvendorById = async (id: string) => {
    const res = await api.get(`/vendors/${id}`)
    return res.data
}

// update vendor (admin)
export const updateVendor = async (id: string, data: FormData) => {
    const res = await api.put(`/vendors/${id}`, data, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
    return res.data
}

// delete vendor (admin)
export const deleteVendor = async (id: string) => {
    const res = await api.delete(`/vendors/${id}`)
    return res.data
}