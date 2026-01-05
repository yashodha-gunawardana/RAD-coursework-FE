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
/*export const getMyEvents = async (
  page: number = 1,
  limit: number = 6,
  searchTerm: string = "",
  typeFilter: string = "",
  statusFilter: string = ""
) => {

  const params = new URLSearchParams()
  params.set("page", page.toString())
  params.set("limit", limit.toString())

  if (searchTerm) params.set("search", searchTerm)
  if (typeFilter) params.set("type", typeFilter)
  if (statusFilter) params.set("status", statusFilter)

  const res = await api.get(`/events/my?${params.toString()}`)
  return res.data
}*/
export const getMyEvents = async (
  page: number = 1,
  limit: number = 6,
  searchTerm: string = "",
  typeFilter: string = "",
  statusFilter: string = ""
) => {
  const params = new URLSearchParams()
  params.set("page", page.toString())
  params.set("limit", limit.toString())

  if (searchTerm) params.set("search", searchTerm)
  if (typeFilter) params.set("type", typeFilter)
  if (statusFilter) params.set("status", statusFilter)

  const res = await api.get(`/events/my?${params.toString()}`)
  return res.data
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


// get ALL events (admin only)
export const getAllEvents = async (
  page: number = 1,
  limit: number = 6,
  searchTerm = "",
  typeFilter = "",
  statusFilter = ""
) => {
  const params = new URLSearchParams()
  params.set("page", page.toString())
  params.set("limit", limit.toString())

  if (searchTerm) params.set("search", searchTerm)
  if (typeFilter) params.set("type", typeFilter)
  if (statusFilter) params.set("status", statusFilter)

  
  console.log("Request URL: /events/all?" + params.toString());
  const res = await api.get(`/events/all?${params.toString()}`)
  return res.data
}


export const getAllEventsForSelect = async () => {
    const res = await api.get("/events/dropdown")
    return res.data
}

