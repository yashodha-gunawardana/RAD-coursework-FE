import api from "./api";

// Get dashboard statistics
export const getDashboardStats = async () => {
    try {
        const res = await api.get("/dashboard/stats");
        return res.data;
    } catch (error: any) {
        console.error("getDashboardStats error:", error.response?.data || error.message);
        throw error;
    }
};

// Get recent activities
export const getRecentActivities = async (limit: number = 10) => {
    try {
        const res = await api.get("/dashboard/activities", { params: { limit } });
        return res.data;
    } catch (error: any) {
        console.error("getRecentActivities error:", error.response?.data || error.message);
        throw error;
    }
};

// Get upcoming events
export const getUpcomingEvents = async (limit: number = 5) => {
    try {
        const res = await api.get("/events/upcoming", { params: { limit } });
        return res.data;
    } catch (error: any) {
        console.error("getUpcomingEvents error:", error.response?.data || error.message);
        throw error;
    }
};