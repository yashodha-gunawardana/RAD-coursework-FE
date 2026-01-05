import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Filter,
  Edit,
  Eye,
  Trash2,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
} from "react-feather";
import { deleteEvent, getAllEvents, getMyEvents } from "../../services/events";
import { useAuth } from "../../context/authContext";


const formatDate = (dateString: string): string => {

    // convert string to date object
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
}

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2

        // convert number to currency format
    }).format(amount)
}

interface ExtraItem {
    name: string
    unitPrice: number
    quantity?: number
}

interface Event {
    _id: string
    title: string;
    type: string;
    date: string; 
    time?: string;
    location: string;
    description?: string;
    basePrice: number;
    status: string;
    extraItems?: ExtraItem[];
    image?: string;
    userId?: {
        _id: string,
        name: string,
        email: string
    };
    createdAt: string;
    updatedAt: string;
}


// type UserRole = "ADMIN" | "USER" | "VENDOR" | null

interface ToastState {
    show: boolean
    message: string
    type: "success" | "error"
}

/*const EventType = {
    WEDDING: "WEDDING",
    BIRTHDAY: "BIRTHDAY",
    CONFERENCE: "CONFERENCE",
    CORPORATE: "CORPORATE",
    PARTY: "PARTY",
    OTHER: "OTHER"
} as const;*/

const EventStatus = {
    PLANNING: "PLANNING",
    ONGOING: "ONGOING",
    COMPLETED: "COMPLETED",
    CANCELLED: "CANCELLED"
} as const;


const EventsPage: React.FC = () => {
    const navigate = useNavigate()

    const { user } = useAuth()

    const isAdmin = user?.roles?.includes("ADMIN")
    // const isVendor = user?.roles?.includes("VENDOR")
    const isUser = user?.roles?.includes("USER")


    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)
    const [toast, setToast] = useState<ToastState>({ show: false, message: " ", type: "success" })

    const [searchTerm, setSearchTerm] = useState("")
    const [typeFilter, setTypeFilter] = useState("")
    const [statusFilter, setStatusFilter] = useState("")
    const [allEvents, setAllEvents] = useState<Event[]>([]); 

    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalItems, setTotalItems] = useState(0)
    const limit = 6

    // const [isAdmin, setIsAdmin] = useState(true)
 // const [role, setRole] = useState<UserRole>(null)


    // check if user is admin 
   /* useEffect(() => {
        const userData = localStorage.getItem("user")

        if (userData) {
            try {
                const user = JSON.parse(userData)
                setIsAdmin(user?.roles?.includes("ADMIN") || false)

            } catch (err) {
                console.log("Error parsing user data: ", err)
                setIsAdmin(false)
            }
        }
    })*/
   /* useEffect(() => {
        const userData = localStorage.getItem("user")
        if (!userData) return

        try {
            const user = JSON.parse(userData)
            setRole(user?.roles?.[0] || null)

        } catch {
            setRole(null)
        }
    }, [])*/
   

    // calculate total price
    /*const calculateTotalPrice = useCallback((event: Event) => {
        let total = event.basePrice || 0

        if (event.extraItems && event.extraItems.length > 0) {
            event.extraItems.forEach(item => {
                total += (item.unitPrice || 0) * (item.quantity || 1)
            })
        }
        return total
    }, []);*/
    const calculateTotalPrice = useCallback((event: Event) => {
        let total = event.basePrice || 0

        if (event.extraItems && event.extraItems.length > 0) {
            event.extraItems.forEach(item => {
                total += (item.unitPrice || 0) * (item.quantity || 1)
            })
        }
        return total
    }, []);



    const getEventTypeLabel = useCallback((type: string) => {
        const labels: Record<string, string> = {
            WEDDING: "Wedding",
            BIRTHDAY: "Birthday",
            CONFERENCE: "Conference",
            CORPORATE: "Corporate",
            PARTY: "Party",
            OTHER: "Other"
        }
        return labels[type] || type
    }, [])


    // status badge
    const getStatusClass = useCallback((status: string) => {
        const classes: Record<string, string> = {
            "PLANNING": "bg-blue-100 text-blue-800 border border-blue-200",
            "ONGOING": "bg-green-100 text-green-800 border border-green-200",
            "COMPLETED": "bg-yellow-100 text-yellow-800 border border-yellow-200",
            "CANCELLED": "bg-red-100 text-red-800 border border-red-200"
        }
        return classes[status] || "bg-gray-100 text-gray-800 border border-gray-200"
    }, [])


    // toast notification
    const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
        setToast({ show: true, message, type })
        setTimeout(() =>{
            setToast(prev => ({ ...prev, show: false }))
        }, 3000)
    }, [])



    // load events with pagination - always get all events
    /*const loadEvents = useCallback(async (pageNumber: number = 1) => {
        try {
            setLoading(true) 
            console.log("Loading ALL events...")
            
            const response = await getAllEvents(
                pageNumber,
                limit,
                searchTerm.trim() || undefined,
                typeFilter || undefined,
                statusFilter || undefined
            );

            // Handle response
            if (!response || !response.data) {
                console.log("No data in response")

                setEvents([])
                setTotalPages(1)
                setTotalItems(0)
                setPage(pageNumber)
                return
            }

            console.log("Loaded events:", response.data.length)

            setEvents(response.data || [])
            setTotalPages(response.totalPages || 1)
            setTotalItems(response.totalItems || 0)
            setPage(pageNumber)
            
        } catch (err: any) {
            console.error("Error loading events: ", err)

            showToast("Failed to load events", "error")
            setEvents([])

        } finally {
            setLoading(false)
        }
    }, [searchTerm, typeFilter, statusFilter, showToast])*/
    const loadEvents = useCallback(async (pageNumber: number = 1) => {
  try {
    if (!user)
        return

    setLoading(true);

    let response;

    if (isAdmin) {
      // ADMIN → ALL EVENTS
      response = await getAllEvents(
        pageNumber,
        limit,
        searchTerm.trim() || undefined,
        typeFilter || undefined,
        statusFilter || undefined
      );
    } else {
      // USER / VENDOR → OWN EVENTS
    //   response = await getMyEvents(pageNumber, limit);
    response = await getMyEvents(
        pageNumber,
        limit,
        searchTerm.trim() || undefined,
        typeFilter || undefined,
        statusFilter || undefined
      );
    }

    if (!response || !response.data) {
      setEvents([]);
      setTotalPages(1);
      setTotalItems(0);
      return;
    }

    setEvents(response.data);
    setTotalPages(response.totalPages || 1);
    setTotalItems(response.totalItems || response.data.length);
    setPage(pageNumber);

  } catch (err) {
    console.error("Error loading events:", err);
    showToast("Failed to load events", "error");
    setEvents([]);
  } finally {
    setLoading(false);
  }
}, [user, isAdmin, searchTerm, typeFilter, statusFilter, showToast]);


// load pagination events when page or filter change
    useEffect(() => {
        console.log("Page or filters changed, loading events...")

        loadEvents(page)
    }, [page, loadEvents])


    // load all event for stats
    /*const loadAllEvents = useCallback(async () => {
        try {
            console.log("Loading ALL events for stats...")

            const response = await getAllEvents(1, 1000)
            
            if (response && response.data) {
                console.log("All events loaded for stats:", response.data.length)
                setAllEvents(response.data || [])

            } else {
                console.log("No data for stats")
                setAllEvents([]);
            }

        } catch (err) {
            console.error("Error loading all events for stats:", err)
            setAllEvents([])
        }
    }, [])*/
    const loadAllEvents = useCallback(async () => {
  if (!isAdmin) {
    setAllEvents([]); // no stats for non-admin
    return;
  }

  try {
    const response = await getAllEvents(1, 1000);
    setAllEvents(response?.data || []);
  } catch (err) {
    console.error("Error loading all events for stats:", err);
    setAllEvents([]);
  }
}, [isAdmin]);


    
    
    // load all events once for stats
    useEffect(() => {
            console.log("User role changed, loading all events for stats...")
        loadAllEvents();
    }, [loadAllEvents])

    // delete handler
    const handleDeleteEvent = useCallback(async (id: string, title: string) => {
        if(!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`))
        return

        try {
             setEvents(prev => prev.filter(event => event._id !== id))

            const res = await deleteEvent(id)
            showToast("Event deleted successfully.", "success")
            console.log("Delete response:", res)

            const isLastItemOnPage = events.length === 1
            const newPage = isLastItemOnPage && page > 1 ? page - 1 : page

            
            setPage(newPage)
            loadEvents(newPage)
            loadAllEvents()
        
        } catch (err: any) {
            console.error("Error deleting event:", err)
            showToast("Failed to delete event.", "error")
            loadEvents()

        }
    }, [loadEvents, page, events.length, loadAllEvents, showToast])


    // dashboard statistics
    const stats = React.useMemo(() => {
        const totalEvents = allEvents.length
        const activeEvents = allEvents.filter(e => e.status === EventStatus.ONGOING).length
        const totalRevenue = allEvents.reduce((sum, event) => sum + calculateTotalPrice(event), 0)

        // within next 30 days from today
        const today = new Date()
        const nextMonth = new Date()
        nextMonth.setDate(today.getDate() + 30)
        
        const upcomingEvents = allEvents.filter(e => {
            const eventDate = new Date(e.date)
            return eventDate > today && eventDate <= nextMonth
        }).length

        return { totalEvents, activeEvents, upcomingEvents, totalRevenue }
    }, [allEvents, calculateTotalPrice])


    // filter reset
    const resetFilters = useCallback(() => {
        setSearchTerm('');
        setTypeFilter('');
        setStatusFilter('');
        setPage(1)
        showToast('Filters cleared');
    }, [showToast]);


    // full details view
    const viewEventDetails = useCallback((event: Event) => {
        const totalPrice = calculateTotalPrice(event)

        let details = `Event Details:\n\n`
        details += `Title: ${event.title}\n`
        details += `Type: ${getEventTypeLabel(event.type)}\n`
        details += `Date: ${formatDate(event.date)}${event.time ? ` at ${event.time}` : ``}\n`
        details += `Location: ${event.location}\n`
        details += `Status: ${event.status}\n`
        details += `Base Price: ${formatCurrency(event.basePrice)}\n`
        details += `Total Price: ${formatCurrency(totalPrice)}\n\n`

        if (event.description) {
            details += `Description: ${event.description}\n\n`
        }

        if (event.extraItems && event.extraItems.length > 0) {
            details += `Extra Items:\n`
            event.extraItems.forEach((item: ExtraItem) => {
                const quantity = item.quantity || 1
                details += `• ${item.name}: ${formatCurrency(item.unitPrice)} × ${quantity} = ${formatCurrency(item.unitPrice * quantity)}\n`
            })
        }

        alert(details)
    }, [calculateTotalPrice, getEventTypeLabel])



    


    // reset page when filters change
   /* useEffect(() => {
                console.log("Filters changed, resetting page to 1")

        setPage(1);
    }, [searchTerm, typeFilter, statusFilter])


    useEffect(() => {
        if (isAdmin !== null) {
            console.log("Admin status changed to:", isAdmin);
            loadEvents(1);
            loadAllEvents();
        }
    }, [isAdmin, loadEvents, loadAllEvents]);*/


    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F8F5F0] to-[#E8E3D8] p-5 md:p-10">

            {/* toast notification */}
            {toast.show && (
                <div className={`fixed bottom-6 right-6 bg-white text-gray-900 px-6 py-4 rounded-xl shadow-lg z-50
                                    animate-slideIn flex items-center gap-3 
                                    ${toast.type === "success" ? "border-l-4 border-green-500" : "border-l-4 border-red-500"}
                                `}>

                    {toast.type === "success" ? (
                        <CheckCircle className="text-green-500" size={20} />
                    ) : (
                        <AlertCircle className="text-red-500" size={20} />
                    )}

                    <span>{toast.message}</span>
                </div>
            )}


            <div className="max-w-7xl mx-auto">

                {/* header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:ietms-center gap-4 mb-8
                                    pb-6 border-b border-gray-200">
                                    
                    <div>
                        <h1 className="text-3xl md:text-6xl font-bold text-[#8B0000]/80 font-[poppins]">
              
                            Event Dashboard
                        </h1>

                        <p className="text-[#0F0F0F]/80 leading-relaxed text-l mt-1">
                            Professional Event Management System
                        </p>
                    </div>

                    <div className="flex gap-3">
                        {(isAdmin || isUser) && (
                            <button
                                onClick={() => navigate("/dashboard/events/create")}
                                className="px-6 py-3 bg-gradient-to-r from-red-800 to-red-600 text-white rounded-lg font-semibold 
                                            hover:shadow-lg transition-all flex items-center gap-2 hover:-translate-y-0.5">
                                
                                    <Plus size={18} />
                                    
                                        Create Event
                            </button>
                        )}
                    </div>
                </header>

                {/* stats card */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-[#F5F5F5] to-[#8B0000]/20 rounded-xl p-6 shadow-md border border-[#8B0000]/10 hover:shadow-lg transition-all 
                                    hover:-translate-y-1">

                        <div className="flex justify-between items-center mb-4">
                            <div className="text-sm font-semibold text-[#0A0A0A] uppercase tracking-wide">Total Events</div>
                            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                
                                <Calendar className="text-red-800" size={24} />
                            
                            </div>
                        </div>

                        <div className="text-3xl font-bold text-gray-900 mb-2">{stats.totalEvents}</div>
                        <div className="text-sm text-green-600 font-medium flex items-center gap-1">
                        
                            <TrendingUp size={16} />

                                12% from last month
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#F5F5F5] to-[#8B0000]/20 rounded-xl p-6 shadow-md border border-[#8B0000]/10 hover:shadow-lg transition-all 
                                    hover:-translate-y-1">

                        <div className="flex justify-between items-center mb-4">
                            <div className="text-sm font-semibold text-[#0A0A0A] uppercase tracking-wide">Active Events</div>
                            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                                
                                <CheckCircle className="text-green-600" size={24} />

                            </div>
                        </div>

                        <div className="text-3xl font-bold text-gray-900 mb-2">{stats.activeEvents}</div>
                        <div className="text-sm text-green-600 font-medium flex items-center gap-1">
                            
                            <TrendingUp size={16} />
                                
                                3 ongoing events
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#F5F5F5] to-[#8B0000]/20 rounded-xl p-6 shadow-md border border-[#8B0000]/10 hover:shadow-lg transition-all 
                                    hover:-translate-y-1">
                        
                        <div className="flex justify-between items-center mb-4">
                            <div className="text-sm font-semibold text-[#0A0A0A] uppercase tracking-wide">Upcoming Events</div>
                            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                                
                                <Clock className="text-blue-600" size={24} />

                            </div>
                        </div>

                        <div className="text-3xl font-bold text-gray-900 mb-2">{stats.upcomingEvents}</div>
                        <div className="text-sm text-red-600 font-medium flex items-center gap-1">
                        
                            <TrendingDown size={16} />

                                2 in next week
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#F5F5F5] to-[#8B0000]/20 rounded-xl p-6 shadow-md border border-[#8B0000]/10 hover:shadow-lg transition-all 
                                    hover:-translate-y-1">
            
                        <div className="flex justify-between items-center mb-4">
                            <div className="text-sm font-semibold text-[#0A0A0A] uppercase tracking-wide">Total Revenue</div>
                            <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                                
                                <DollarSign className="text-yellow-600" size={24} />

                            </div>
                        </div>

                        <div className="text-3xl font-bold text-gray-900 mb-2">{formatCurrency(stats.totalRevenue)}</div>
                        <div className="text-sm text-green-600 font-medium flex items-center gap-1">
                            
                            <TrendingUp size={16} />

                                18% increase
                        </div>
                    </div>
                </div>

                {/* main content */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                    <div className="px-6 py-6 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start 
                                    md:items-center gap-4">

                        <div>
                            <h2 className="text-2xl font-bold text-[#8B0000]/80 font-serif">Event Management</h2>
                            <p className="text-[#0F0F0F]/80 leading-relaxed text-[13px] mt-1">Manage all events in one place</p>
                        </div>

                        <button
                            onClick={resetFilters}
                            className="px-4 py-2 bg-green-300 border border-green-800 text-black-900 rounded-lg font-medium hover:bg-green-200 
                                        transition-all flex items-center gap-2">
              
                                <Filter size={16} />
                                    
                                    View All
                        </button>
                    </div>

                    {/* filters */}
                    <div className="px-6 py-5 bg-gray-50 border-b border-gray-200 flex flex-col md:flex-row gap-4 items-start 
                                    md:items-center">
                        
                        <div className="flex-1 min-w-0 w-full md:w-auto">
                            <div className="relative">

                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black" size={18} />

                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search events by title, loacation, or description..."
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 
                                                focus:ring-red-500 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 w-full md:w-auto">

                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 
                                            focus:ring-red-500 focus:border-transparent transition-all min-w-[160px]">

                                <option value="">All Types</option>
                                <option value="WEDDING">Wedding</option>
                                <option value="BIRTHDAY">Birthday</option>
                                <option value="CONFERENCE">Conference</option>
                                <option value="CORPORATE">Corporate</option>
                                <option value="PARTY">Party</option>
                                <option value="OTHER">Other</option>
                            </select>

                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 
                                            focus:ring-red-500 focus:border-transparent transition-all min-w-[160px]">

                                <option value="">All Status</option>
                                <option value="PLANNING">Planning</option>
                                <option value="ONGOING">Ongoing</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                        </div>
                    </div>

                    {/* event list */}
                    <div className="p-6">
                        {loading ? (

                            <div className="flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-800"></div>
                            </div>

                        ) : events.length === 0 ? (

                            <div className="text-center py-12">

                                <Calendar className="text-gray-300 mx-auto mb-4" size={64} />

                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    {searchTerm || typeFilter || statusFilter 
                                        ? 'No Events Match Your Filters' 
                                        : 'No Events Found'
                                    }
                                </h3>

                                <p className="text-gray-600 max-w-md mx-auto mb-6">
                                    {searchTerm || typeFilter || statusFilter
                                        ? 'Try adjusting your search or filter criteria.'
                                        : 'Get started by creating your first event. Plan, organize, and manage everything in one place.'
                                    }
                                </p>
                                
                                {(isAdmin || isUser) && (
                                    <button
                                        onClick={() => navigate("/dashboard/events/create")}
                                        className="px-6 py-3 bg-gradient-to-r from-red-800 to-red-600 text-white rounded-lg font-semibold 
                                                    hover:shadow-lg transition-all inline-flex items-center gap-2">

                                            <Plus size={18} />

                                                Create Your First Event
                                    </button>
                                )}
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                                    {events.map((event) => {
                                        const totalPrice = calculateTotalPrice(event)

                                        return (
                                            <div
                                                key={event._id}
                                                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm 
                                                            hover:shadow-lg transition-all hover:-translate-y-1">  

                                                {/* form image as cover photo */}
                                                <div className="h-40 relative overflow-hidden">
                                                    {event.image ? (
                                                        <div
                                                            className="w-full h-full bg-cover bg-center opacity-80"
                                                            style={{ backgroundImage: `url(${event.image})` }}
                                                        />
                                                    ) : (
                                                        
                                                        <div className="relative h-50 w-98 overflow-hidden rounded-xl bg-[#C2A886] shadow-lg">
                                                            <div className="absolute inset-0 bg-gradient-to-br from-[#4A0404]/40 via-transparent to-[#4A0404]/20"></div>

                                                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(248,244,227,0.3)_0%,transparent_80%)]"></div>

                                                            <div className="absolute inset-x-0 top-0 h-px bg-white/20"></div>

                                                            <div className="relative flex h-full flex-col items-center justify-center">
                                                                <div className="text-[#4A0404]/70 drop-shadow-sm">
                                                                    
                                                                    <Calendar size={60} strokeWidth={1.2} />

                                                                </div>
                                                                
                                                                <div className="mt-4 flex flex-col items-center">
                                                                    <div className="h-px w-20 bg-gradient-to-r from-transparent via-[#4A0404]/30 to-transparent"></div>
                                                                    <span className="mt-2 text-[10px] uppercase tracking-[0.2em] text-[#4A0404]/50 font-medium">
                                                                        
                                                                        Established
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Type Badge */}
                                                    <div className="absolute top-4 left-4 bg-white/90 text-red-800 px-3 py-1 rounded-full text-xs 
                                                                    font-semibold uppercase tracking-wide">
                                                        
                                                        {getEventTypeLabel(event.type)}
                                                    </div>

                                                    {/* Status Badge */}
                                                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold 
                                                                    ${getStatusClass(event.status)}`}>
                                                        
                                                        {event.status}
                                                    </div>
                                                </div>

                                                <div className="p-5">
                                                    <h3 className="text-lg font-semibold mb-4 line-clamp-2">
                                
                                                        {event.title.charAt(0).toUpperCase() + event.title.slice(1)}
                                                    </h3>

                                                    <div className="space-y-3 mb-5 text-[#0A0A0A]/90">
                                                        <div className="flex items-start gap-3">

                                                            <Calendar size={16} className="mt-1.5 flex-shrink-0 text-red-800" />

                                                            <div>
                                                                <div className="font-lg">{formatDate(event.date)}</div>
                                                                
                                                                {event.time && (
                                                                    <div className="text-sm">{event.time}</div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="flex items-start gap-3">
                                        
                                                            <Eye size={16} className="mt-1 flex-shrink-0 text-red-800" />
                                                            <span className="line-clamp-1 font-lg">{event.location}</span>
                                                        </div>

                                                        {event.description && (
                                                            <div className="flex items-start gap-3">
                                
                                                                <AlertCircle size={16} className="mt-1 flex-shrink-0 text-red-800" />
                                                                <span className="line-clamp-2 font-lg">{event.description}</span>
                                                            </div>
                                                        )}

                                                        {event.extraItems && event.extraItems.length > 0 && (
                                                            <div className="flex items-start gap-3 text-gray-600">
                                                                
                                                                <Plus size={16} className="mt-0.5 flex-shrink-0 text-red-800" />
                                                                <span>{event.extraItems.length} extra item{event.extraItems.length !== 1 ? 's' : ''}</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex justify-between items-center mb-4">
                                                        <div className="text-xl font-bold text-red-800">
                                                            {formatCurrency(totalPrice)}
                                                        </div>

                                                        <div className="text-sm text-gray-500">
                                                            Base: {formatCurrency(event.basePrice)}
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-2">
                                                        {isAdmin && (
                                                            <>
                                                            <button
                                                                onClick={() => navigate(`/dashboard/events/create?edit=${event._id}`)}
                                                                className="flex-1 px-3 py-2 bg-yellow-100 border border-yellow-300 text-yellow-700 rounded-lg font-medium 
                                                                            hover:bg-yellow-50 transition-all flex items-center justify-center gap-1">
                                                                
                                                                    <Edit size={16} />
                                                                    
                                                                        Edit
                                                            </button>

                                                            <button
                                                                onClick={() => handleDeleteEvent(event._id, event.title)}
                                                                className="flex-1 px-3 py-2 bg-red-100 border border-red-300 text-red-800 rounded-lg font-medium hover:bg-red-50 
                                                                            hover:text-red transition-all flex items-center justify-center gap-1">
                                                                
                                                                    <Trash2 size={16} />

                                                                        Delete
                                                            </button>
                                                            </>
                                                        )}

                                                        <button
                                                            onClick={() => viewEventDetails(event)}
                                                            className="flex-1 px-3 py-2 bg-blue-100 border border-blue-300 text-blue-700 rounded-lg font-medium 
                                                                        hover:bg-blue-50 transition-all flex items-center justify-center gap-1">
                                                                
                                                                <Eye size={16} />

                                                                    View
                                                        </button>
                                                    </div>

                                                    {/* <ConfirmDialog
                                                        isOpen={deleteDialog.open}
                                                        title="Delete Event?"
                                                        message={`Are you sure you want to delete "${deleteDialog.title || 'this event'}"? This action cannot be undone.`}
                                                        confirmText="Delete"
                                                        cancelText="Cancel"
                                                        danger={true}
                                                        onConfirm={confirmDelete}
                                                        onCancel={() => setDeleteDialog({ open: false })}
                                                    /> */}
                                                 </div>
                                            </div>
                                        )
                                    })}
                                </div>

                                {/* pagination */}
                                {totalPages > 1 && (
                                    <div className="mt-15 flex flex-col sm:flex-col justify-center items-center gap-4 text-sm text-gray-600">
                    
                                        <div>
                                            Showing{' '}
                                            <span className="font-medium text-gray-900">
                                                {(page - 1) * limit + 1}–{Math.min(page * limit, totalItems)}
                                            </span>{' '}
                                            of <span className="font-medium text-gray-900">{totalItems}</span> events
                                        </div>

                                        {/* Navigation buttons */}
                                        <div className="flex items-center gap-2">
                                            <button
                                                disabled={page === 1}
                                                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                                                className="group flex items-center gap-2 rounded-full border border-[#D9B99B]/50 
                                                            bg-[#4A0404]/5 px-6 py-2 text-[#4A0404] transition-all duration-300
                                                            hover:bg-[#4A0404] hover:text-[#F8F4E3] hover:shadow-[0_0_20px_rgba(74,4,4,0.2)]
                                                            active:scale-95
                                                            disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent">
                                                
                                                <span className="text-sm font-semibold tracking-widest uppercase">
                                                    
                                                    Prev
                                                </span>
                                            
                                                <div className="relative flex h-5 w-5 items-center justify-center rounded-full bg-[#4A0404]/10 group-hover:bg-[#F8F4E3]/20">
                                                    
                                                    <ArrowLeft size={14} strokeWidth={3} className="transition-transform group-hover:translate-x-0.5" />
                                                </div>
                                            </button>

                                            <span className="px-4 py-2 font-medium text-gray-900">
                                                
                                                Page {page} of {totalPages}

                                            </span>

                                            <button
                                                disabled={page === totalPages}
                                                onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                                                className="group flex items-center gap-2 rounded-full border border-[#D9B99B]/50 
                                                            bg-[#4A0404]/5 px-6 py-2 text-[#4A0404] transition-all duration-300
                                                            hover:bg-[#4A0404] hover:text-[#F8F4E3] hover:shadow-[0_0_20px_rgba(74,4,4,0.2)]
                                                            active:scale-95
                                                            disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent">
                                                
                                                <span className="text-sm font-semibold tracking-widest uppercase">
                                                    
                                                    Next
                                                </span>
                                            
                                                <div className="relative flex h-5 w-5 items-center justify-center rounded-full bg-[#4A0404]/10 group-hover:bg-[#F8F4E3]/20">
                                                    
                                                    <ArrowRight size={14} strokeWidth={3} className="transition-transform group-hover:translate-x-0.5" />
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EventsPage