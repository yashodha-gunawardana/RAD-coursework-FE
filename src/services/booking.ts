import api from "./api";

// get current user's booking
export const getMyBooking = async () => {
    const res = await api.get("/bookings")
    return res.data
}


// update booking sts
export const updateBooking = async (id: string, data: { status: string; notes?: string }) => {
    const res = await api.put(`/bookings/${id}`, data)
    return res.data
}


// delete booking
export const deleteBooking = async (id: string) => {
    const res = await api.delete(`/bookings/${id}`)
    return res.data
}