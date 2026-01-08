import api from "./api";


// get current user's booking
export const getMyBooking = async () => {
    const res = await api.get("/bookings")
    return res.data
}


// get all bookings (Admin only)
export const getAllBookings = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
}) => {
    try {
        console.log("Calling getAllBookings with params:", params);

        const res = await api.get("/bookings/all", { params });

        console.log("getAllBookings response:", res.data);
        return res.data;

    } catch (error: any) {
        console.error("getAllBookings API error:", error.response?.data || error.message);
        throw error;
    }
}


// Create booking
export const createBooking = async (data: {
    eventId: string
    vendorId: string
    notes?: string
    extraItems?: { name: string, quantity: number }[]
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
    console.log("Calling getVendorBookings API...");

    try {
        const res = await api.get("/bookings/vendor/my-bookings");

        console.log("Vendor bookings response:", res.data);
        return res.data;

    } catch (error: any) {
        console.error("Vendor bookings API error:", error.response?.data || error.message);
        throw error;
    }
}


// vendor booking status
export const updateBookingStatus = async (id: string, status: string) => {
    const res = await api.put(`/bookings/vendor/${id}/status`, { status });
    return res.data;
}
