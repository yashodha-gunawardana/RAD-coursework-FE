import api from "./api";


export const createEvent = async (data: any) => {
    const res = await api.post("/events", data, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return res.data
};

export const getMyEvents = async () => {
  const res = await api.get("/events");
  return res.data;
};


export const getEventById = async (id: string) => {
  const res = await api.get(`/events/${id}`);
  return res.data;
};


export const updateEvent = async (id: string, data: any) => {
  const res = await api.put(`/events/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return res.data;
};


export const deleteEvent = async (id: string) => {
  const res = await api.delete(`/events/${id}`);
  return res.data;
};