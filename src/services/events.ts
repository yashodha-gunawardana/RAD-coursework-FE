import api from "./api";

// Create event (admin only)
export const createEvent = async (formData: FormData) => {
  try {
    const res = await api.post("/events", formData, {
      headers: { 
        "Content-Type": "multipart/form-data" 
      }
    })
    return res.data;

  } catch (err: any) {
    console.error("Failed to create event:", err);
    throw err;
  }
}

// Get own events
export const getMyEvents = async (page = 1) => {
  const res = await api.get(`/events/my?page=${page}`);
  return res.data;
}

// Get event by id
export const getEventById = async (id: string) => {
  const res = await api.get(`/events/${id}`);
  return res.data.data;
}

// Update event (admin only)
export const updateEvent = async (id: string, formData: FormData) => {
  try {
    const res = await api.put(`/events/${id}`, formData, {
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

// Delete event
export const deleteEvent = async (id: string) => {
  const res = await api.delete(`/events/${id}`);
  return res.data;
}
