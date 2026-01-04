import api from "./api";


export interface ExtraItem {
  name: string;
  unitPrice: number;
  quantity: number;
}

// get current user's booking
export const getMyBooking = async () => {
    const res = await api.get("/bookings")
    return res.data
}

// Create booking
export const createBooking = async (data: {
    eventId: string
    vendorId: string
    notes?: string
extraItems?: ExtraItem[]
}) => {

    const res = await api.post("/bookings", data)
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

// Get booking by ID
export const getBookingById = async (id: string) => {
    const res = await api.get(`/bookings/${id}`)
    return res.data
}


// get booking asssigned to logged-in vendor
export const getVendorBookings = async () => {
    const res = await api.get("/bookings/vendor/bookings")
    return res.data;
}

// vendor booking status
export const updateBookingStatus = async (id: string, status: string) => {
    const res = await api.put(`/bookings/vendor/bookings/${id}/status`, { status });
    return res.data;
}
