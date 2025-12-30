import api from "./api";

// create vendor
export const createVendor = async (data: FormData) => {
    const res = await api.post("/vendors", data, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
    return res.data
}