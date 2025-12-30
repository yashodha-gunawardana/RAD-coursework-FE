import api from "./api";

// create event (admin)
export const createEvent = async (data: FormData) => {
    const res = await api.post("/events", data, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return res.data
};

// get own events (public)
export const getMyEvents = async () => {
  const res = await api.get("/events");
  return res.data;
};

// get event by id (public)
export const getEventById = async (id: string) => {
  const res = await api.get(`/events/${id}`);
  return res.data;
};

// update event (admin)
export const updateEvent = async (id: string, data: FormData) => {
  const res = await api.put(`/events/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return res.data;
};

// delete event (admin)
export const deleteEvent = async (id: string) => {
  const res = await api.delete(`/events/${id}`);
  return res.data;
};