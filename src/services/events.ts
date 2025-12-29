import api from "./api";


export const createEvent = async (data: any) => {
    const res = await api.post("/events", data, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return res.data
}