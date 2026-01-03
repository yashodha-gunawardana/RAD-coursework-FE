import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  CheckCircle,
  XCircle,
  Filter,
  Search,
  Trash2,
  AlertCircle,
  TrendingUp,
  Clock,
  DollarSign,
  User,
  Plus,
  X,
} from "react-feather";
import { createBooking, getMyBooking, updateBooking, deleteBooking, getVendorBookings, updateBookingStatus } from "../../services/booking";
import { getAllEventsForSelect } from "../../services/events";
import { getAllVendorsForSelect } from "../../services/vendor";


export const BookingStatus = {
    PENDING: "PENDING",
    CONFIRMED: "CONFIRMED",
    CANCELLED: "CANCELLED",
    COMPLETED: "COMPLETED"
} as const

export type BookingStatusType = typeof BookingStatus[keyof typeof BookingStatus]


interface Booking {
    _id: string
    eventId: {
        _id: string
        title: string
        date: string
        location: string
    }

    vendorId: {
        _id: string
        name: string
        category: string
        image?: string
    }

    userId: string
    status: BookingStatusType
    notes?: string
    createdAt: string
} 

interface Event {
    _id: string
    title: string
    date: string
    location: string
}

interface Vendor {
    _id: string
    name: string
    category: string
    image?: string
}

interface ToastState {
    show: boolean
    message: string
    type: "success" | "error"
}


const getStatusBadgeClass = (status: BookingStatusType): string => {
    switch (status) {
        case "CONFIRMED":
            return "bg-green-100 text-green-800 border border-green-200"

        case "PENDING":
            return "bg-yellow-100 text-yellow-800 border border-yellow-200"

        case "CANCELLED":
            return "bg-red-100 text-red-800 border border-red-200"

        case "COMPLETED":
            return "bg-blue-100 text-blue-800 border border-blue-200"

        default:
            return "bg-stone-100 text-stone-800 border border-stone-200";
    }
}


const getStatusLabel = (status: BookingStatusType): string => {
    return status.charAt(0) + status.slice(1).toLowerCase()
}


const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    })
}


const userRole = localStorage.getItem("role") || "USER"
const currentUserId = localStorage.getItem("userId")


const BookingPage: React.FC = () => {
    const navigate = useNavigate()

    const [bookings, setBookings] = useState<Booking[]>([])
    const [events, setEvents] = useState<Event[]>([])
    const [vendors, setVendors] = useState<Vendor[]>([])

    const [loading, setLoading] = useState(true)
    const [loadingResources, setLoadingResources] = useState(false)

    const [toast, setToast] = useState<ToastState>({ show: false, message: "", type: "success" })

    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("")

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [selectedEventId, setSelectedEventId] = useState("")
    const [selectedVendorId, setSelectedVendorId] = useState("")
    const [notes, setNotes] = useState("")
    const [creating, setCreating] = useState(false)


    const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
        setToast({ show: true, message, type })
        setTimeout(() => 
            setToast(
                { show: false, message: "", type: "success" }
                
        ), 3000)
    }, [])


    // load user's booking
    const loadBookings = useCallback(async () => {
        try {
            setLoading(true)

            let response
            if (userRole === "VENDOR") {
                response = await getVendorBookings()

            } else {
                response = await getMyBooking()
            }

            // const response = await getMyBooking()
             setBookings(response.data || [])

        } catch (err : any) {
            console.error("Error loading bookings:", err)
            showToast("Failed to load bookings", "error")
        
        } finally {
            setLoading(false)
        }
    }, [showToast])


    // load events and vendors
    const loadResources = useCallback(async () => {
        try {
            setLoadingResources(true)
        
            const [eventRes, vendorRes] = await Promise.all([getAllEventsForSelect(), getAllVendorsForSelect()])

            console.log("Events:", eventRes.data)
            console.log("Vendors:", vendorRes.data)

            setEvents(eventRes.data || [])
            setVendors(vendorRes.data || [])

        } catch (err) {
            showToast("Failed to load events or vendors", "error")

        } finally {
            setLoadingResources(false)
        }
    }, [showToast])


    // Open modal → load data
    const openCreateModal =  async () => {
        setIsCreateModalOpen(true)
        setSelectedEventId("")
        setSelectedVendorId("")
        setNotes("")

        await loadResources()
    }

    
    // create booking
    const handleCreateBooking = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!selectedEventId || !selectedVendorId) {
            showToast("Please select an event and vendor", "error")
            return
        }

        try {
            setCreating(true)
            await createBooking({
                eventId: selectedEventId,
                vendorId: selectedVendorId,
                notes: notes || undefined
            })

            showToast("Booking created successfully.")
            setIsCreateModalOpen(false)
            loadBookings() // refresh list

        } catch (err: any) {
            showToast("Failed to create booking", "error")
        
        } finally {
            setCreating(false)
        }
    }


    // booking status update
    /*const handleStatusChange = useCallback(async (id: string, status: BookingStatusType) => {
        try {
            await updateBooking(id, { status })
            setBookings((prev) => prev.map((b) => (b._id === id ? { ...b, status } : b)))

            showToast(`Booking ${status.toLocaleLowerCase()} successfully`)

        } catch (err: any) {
            showToast("Failed to update booking status", "error")
        }
    }, [showToast])*/


    const handleStatusChange = useCallback(async (id: string, status: BookingStatusType) => {
        try {
            if (userRole === "VENDOR") {
                await updateBookingStatus(id, status);
            } else {
                await updateBooking(id, { status });
            }

            setBookings((prev) => prev.map((b) => (b._id === id ? { ...b, status } : b)))
            showToast(`Booking ${status.toLowerCase()} successfully`)
        } catch (err: any) {
            showToast("Failed to update booking status", "error")
        }
    }, [showToast, userRole])


    // delete booking
    const handleDeleteBooking = useCallback(async (id: string, eventTitle: string) => {
        if (!confirm(`Delete booking for "${eventTitle}"? This cannot be undone.`)) 
            return

        try {
            await deleteBooking(id)
            setBookings((prev) => prev.filter((b) => b._id !== id))

            showToast("Booking deleted successfully")

        } catch (err: any) {
            showToast("Failed to delete booking", "error")
        }
    }, [showToast])


    useEffect(() => {
        loadBookings()
    }, [loadBookings])



    // calculate stats
    const stats = React.useMemo(() => {
        const totalBookings = bookings.length
        const pending = bookings.filter((b) => b.status === "PENDING").length
        const confirmed = bookings.filter((b) => b.status === "CONFIRMED").length
        const completed = bookings.filter((b) => b.status === "COMPLETED").length

        return { totalBookings, pending, confirmed, completed }
    }, [bookings])


    // filters
    const filteredBookings = React.useMemo(() => {
        let result = [...bookings]

        if (searchTerm) {
            const term = searchTerm.toLowerCase()

            result = result.filter(
                (b) =>
                b.eventId.title.toLowerCase().includes(term) ||
                b.vendorId.name.toLowerCase().includes(term) ||
                b.eventId.location.toLowerCase().includes(term)
            )
        }

        if (statusFilter) {
            result = result.filter((b) => b.status === statusFilter)
        }

        return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    }, [bookings, searchTerm, statusFilter])


    // reset field
    const resetFilters = useCallback(() => {
        setSearchTerm("")
        setStatusFilter("")
        showToast("Filteres cleared")
    }, [showToast])


    

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F8F5F0] to-[#E8E3D8] p-5 md:p-10">

            {/* Toast */}
            {toast.show && (
                <div
                    className={`fixed bottom-6 right-6 bg-white text-gray-900 px-6 py-4 rounded-xl shadow-lg z-50
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
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-gray-200">
                    <div>
                        <h1 className="text-3xl md:text-6xl font-bold text-[#8B0000]/80 font-[poppins]">
                            
                            Bookings Dashboard

                        </h1>

                        <p className="text-[#0F0F0F]/80 leading-relaxed text-l mt-1">
                            Professional Booking Management System
                        </p>
                    </div>

                    {/* add new booking btn */}
                    {userRole !== "VENDOR" && (
                        <div className="flex gap-3">
                            <button
                                onClick={openCreateModal}
                                className="px-6 py-3 bg-gradient-to-r from-red-800 to-red-600 text-white rounded-lg font-semibold 
                                            hover:shadow-lg transition-all flex items-center gap-2 hover:-translate-y-0.5">
                                                    
                                    <Plus size={18} />
                                                        
                                        New Booking
                            </button>
                        </div>
                    )}
                </header>

                {/* stats card */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

                    <div className="bg-gradient-to-br from-[#F5F5F5] to-[#8B0000]/20 rounded-xl p-6 shadow-md border border-[#8B0000]/10 hover:shadow-lg 
                                    transition-all hover:-translate-y-1">

                        <div className="flex justify-between items-center mb-4">
                            <div className="text-sm font-semibold text-[#0A0A0A] uppercase tracking-wide">Total Bookings</div>
                            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                                    
                                <Calendar className="text-red-800" size={24} />
                                    
                            </div>
                        </div>

                        <div className="text-3xl font-bold text-gray-900 mb-2">{stats.totalBookings}</div>
                        <div className="text-sm text-green-600 font-medium flex items-center gap-1">
                            
                            <TrendingUp size={16} />
                                    
                                All time bookings
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#F5F5F5] to-[#8B0000]/20 rounded-xl p-6 shadow-md border border-[#8B0000]/10 hover:shadow-lg 
                                    transition-all hover:-translate-y-1">
                        
                        <div className="flex justify-between items-center mb-4">
                            <div className="text-sm font-semibold text-[#0A0A0A] uppercase tracking-wide">Pending</div>
                            <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                                
                                <Clock className="text-yellow-600" size={24} />

                            </div>
                        </div>

                        <div className="text-3xl font-bold text-gray-900 mb-2">{stats.pending}</div>
                        <div className="text-sm text-yellow-600 font-medium flex items-center gap-1">
                            
                            <Clock size={16} />

                                Awaiting confirmation
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#F5F5F5] to-[#8B0000]/20 rounded-xl p-6 shadow-md border border-[#8B0000]/10 hover:shadow-lg 
                                    transition-all hover:-translate-y-1">
                                        
                        <div className="flex justify-between items-center mb-4">
                            <div className="text-sm font-semibold text-[#0A0A0A] uppercase tracking-wide">Confirmed</div>
                            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                                
                                <CheckCircle className="text-green-600" size={24} />

                            </div>
                        </div>

                        <div className="text-3xl font-bold text-gray-900 mb-2">{stats.confirmed}</div>
                        <div className="text-sm text-green-600 font-medium flex items-center gap-1">
                            
                            <TrendingUp size={16} />

                                Active bookings
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#F5F5F5] to-[#8B0000]/20 rounded-xl p-6 shadow-md border border-[#8B0000]/10 hover:shadow-lg 
                                    transition-all hover:-translate-y-1">

                        <div className="flex justify-between items-center mb-4">
                            <div className="text-sm font-semibold text-[#0A0A0A] uppercase tracking-wide">Completed</div>
                            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                                
                                <DollarSign className="text-blue-600" size={24} />

                            </div>
                        </div>

                        <div className="text-3xl font-bold text-gray-900 mb-2">{stats.completed}</div>
                        <div className="text-sm text-blue-600 font-medium flex items-center gap-1">
                            
                            <CheckCircle size={16} />

                                Successfully completed
                        </div>
                    </div>
                </div>

                {/* main content */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">

                    <div className="px-6 py-6 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-[#8B0000]/80 font-serif">
                                
                                Booking Management
                            </h2>

                            <p className="text-[#0F0F0F]/80 leading-relaxed text-[13px] mt-1">
                                View and manage your vendor bookings
                            </p>
                        </div>

                        <button
                            onClick={resetFilters}
                            className="px-4 py-2 bg-green-300 border border-green-800 text-black rounded-lg font-medium hover:bg-green-200 
                                        transition-all flex items-center gap-2">
                            
                                <Filter size={16} />
                                    
                                    View All
                        </button>
                    </div>

                    {/* filters */}
                    <div className="px-6 py-5 bg-gray-50 border-b border-gray-200 flex flex-col md:flex-row gap-4 items-start md:items-center">
                        <div className="flex-1 min-w-0 w-full md:w-auto">
                            
                            <div className="relative">
                                
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search by event title, vendor, or location..."
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none 
                                                focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 w-full md:w-auto">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 
                                            focus:ring-red-500 focus:border-transparent transition-all min-w-[160px]">
                            
                                <option value="">All Status</option>
                                <option value="PENDING">Pending</option>
                                <option value="CONFIRMED">Confirmed</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                        </div>
                    </div>

                    {/* booking grid */}
                    <div className="p-6">

                        {loading ? (

                            <div className="flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-800"></div>
                            </div>

                        ) : filteredBookings.length === 0 ? (

                            <div className="text-center py-12">

                                <Calendar className="text-gray-300 mx-auto mb-4" size={64} />
                                
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    {searchTerm || statusFilter 
                                        ? "No Bookings Match Filters" 
                                        : "No Bookings Found"
                                    }
                                </h3>

                                <p className="text-gray-600 max-w-md mx-auto mb-6">
                                    {searchTerm || statusFilter
                                        ? "Try adjusting your search or filter criteria."
                                        : "You haven't made any vendor bookings yet."
                                    }
                                </p>
                            </div>
                        ) : (

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                                {filteredBookings.map((booking) => (

                                    <div
                                        key={booking._id}
                                        className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg 
                                                    transition-all hover:-translate-y-1">
                                            
                                        <div className="h-40 bg-gradient-to-r from-red-800 to-red-600 relative flex items-center justify-center">
                                            {booking.vendorId.image ? (

                                                <img
                                                    src={booking.vendorId.image}
                                                    alt={booking.vendorId.name}
                                                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                                                />
                                            ) : (

                                                <User className="text-white/80" size={64} />

                                            )}

                                            <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold 
                                                                ${getStatusBadgeClass(booking.status)}
                                                            `}>
                                                    
                                                    {getStatusLabel(booking.status)}
                                            </div>
                                        </div>

                                        <div className="p-5">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                                                
                                                {booking.eventId.title}

                                            </h3>

                                            <p className="text-sm text-gray-600 mb-3">

                                                <strong>Vendor:</strong> {booking.vendorId.name}
                                            </p>

                                            <div className="space-y-2 text-sm text-gray-600 mb-4">

                                                <p><strong>Date:</strong> {formatDate(booking.eventId.date)}</p>
                                                <p><strong>Location:</strong> {booking.eventId.location}</p>

                                            </div>

                                            {booking.notes && (
                                                <p className="text-sm text-gray-500 italic mb-4 line-clamp-2">
                                                    "{booking.notes}"
                                                </p>
                                            )}


                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {booking.status === "PENDING" &&  userRole !== "USER" && (
                                                    <>
                                                        <button
                                                            onClick={() => handleStatusChange(booking._id, "CONFIRMED")}
                                                            className="flex-1 px-3 py-2 bg-green-100 text-green-800 rounded-lg font-medium hover:bg-green-200 
                                                                        transition-all flex items-center justify-center gap-1">
                                                            
                                                                
                                                                <CheckCircle size={16} />
                                                                    
                                                                    Confirm
                                                        </button>

                                                        <button
                                                            onClick={() => handleStatusChange(booking._id, "CANCELLED")}
                                                            className="flex-1 px-3 py-2 bg-red-100 text-red-800 rounded-lg font-medium hover:bg-red-200 
                                                                        transition-all flex items-center justify-center gap-1">
                                                            
                                                                <XCircle size={16} />

                                                                    Cancel
                                                        </button>
                                                    </>
                                                )}

                                                {booking.status === "CONFIRMED" && (userRole === "VENDOR" || userRole === "ADMIN") && (
                                                    <button
                                                        onClick={() => handleStatusChange(booking._id, "COMPLETED")}
                                                        className="flex-1 px-3 py-2 bg-blue-100 text-blue-800 rounded-lg font-medium hover:bg-blue-200 
                                                                    transition-all flex items-center justify-center gap-1">
                                                    
                                                            <CheckCircle size={16} />

                                                                Mark Complete
                                                    </button>
                                                )}
                                            </div>

                                            {/* delete button */}
                                            {(userRole === "ADMIN" || booking.userId === currentUserId) && (
                                                <button
                                                    onClick={() => handleDeleteBooking(booking._id, booking.eventId.title)}
                                                    className="w-full px-3 py-2 bg-red-100 text-red-800 rounded-lg font-medium hover:bg-red-800 hover:text-white 
                                                                transition-all flex items-center justify-center gap-1">
                                                
                                                        <Trash2 size={16} />

                                                            Delete Booking
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* create booking modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-8 relative">

                        <button
                            onClick={() => setIsCreateModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                            
                                <X size={24} />

                        </button>

                        <h2 className="text-2xl font-bold text-[#8B0000] mb-6">
                            Create New Vendor Booking
                        </h2>

                        {loadingResources ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-800 mx-auto"></div>
                                <p className="mt-4 text-gray-600">Loading events and vendors...</p>
                            </div>

                        ) : (

                            <form onSubmit={handleCreateBooking} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Event</label>

                                    <select
                                        value={selectedEventId}
                                        onChange={(e) => setSelectedEventId(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 
                                                    focus:border-transparent">
                                    
                                        <option value="">Select an event</option>
                                            
                                        {events.map((event) => (
                                            <option key={event._id} value={event._id}>

                                                {event.title} — {formatDate(event.date)} ({event.location})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Vendor</label>

                                    <select
                                        value={selectedVendorId}
                                        onChange={(e) => setSelectedVendorId(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 
                                                    focus:border-transparent">
                                    
                                        <option value="">Select a vendor</option>

                                        {vendors.map((vendor) => (
                                            <option key={vendor._id} value={vendor._id}>
                                                {vendor.name} ({vendor.category})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>

                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        rows={4}
                                        placeholder="Special requests, timing, setup details..."
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 
                                                    focus:border-transparent"
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="submit"
                                        disabled={creating}
                                        className="flex-1 px-6 py-3 bg-red-800 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-70 
                                                    transition-all">
                                    
                                            {creating ? "Creating..." : "Create Booking"}

                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setIsCreateModalOpen(false)}
                                        className="px-6 py-3 border border-gray-400 rounded-lg hover:bg-gray-100 transition-all">
                                    
                                            Cancel
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}


export default BookingPage