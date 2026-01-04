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
  Plus,
  X,
  Bookmark,
} from "react-feather";
import { createBooking, getMyBooking, updateBooking, deleteBooking, getVendorBookings, updateBookingStatus } from "../../services/booking";
import { getAllEventsForSelect } from "../../services/events";
import { getAllVendorsForSelect } from "../../services/vendor";
import { useAuth } from "../../context/authContext";


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
    basePrice: number
    extraItems?: Array<{
        name: string
        unitPrice: number
    }>
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


const BookingPage: React.FC = () => {
    const navigate = useNavigate()

    const { user } = useAuth()
    const isAdmin = user?.roles.includes("ADMIN")
    const isVendor = user?.roles.includes("VENDOR")
    const isUser  = user?.roles.includes("USER")
    const currentUserId = user?._id

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
    // const [extraItems, setExtraItems] = useState<ExtraItem[]>([])
    const [selectedVendorId, setSelectedVendorId] = useState("")
    const [notes, setNotes] = useState("")
    const [creating, setCreating] = useState(false)

    const [selectedExtraItems, setSelectedExtraItems] = useState<{ name: string; unitPrice: number; quantity: number }[]>([])


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

            const response = isVendor
                ? await getVendorBookings()
                : await getMyBooking()

            // const response = await getMyBooking()
            setBookings(response.data || [])

        } catch (err : any) {
            console.error("Error loading bookings:", err)
            showToast("Failed to load bookings", "error")
        
        } finally {
            setLoading(false)
        }
    }, [isVendor, showToast])


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
        setSelectedExtraItems([])

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
                notes: notes || undefined,
                extraItems: selectedExtraItems.length > 0 ? selectedExtraItems : undefined
                
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

            if (isVendor) {
                await updateBookingStatus(id, status)

            } else if (isAdmin) {
                await updateBooking(id, { status })
            }

            setBookings((prev) => prev.map((b) => (b._id === id ? { ...b, status } : b)))
            showToast(`Booking ${status.toLowerCase()} successfully`)
        } catch (err: any) {
            showToast("Failed to update booking status", "error")
        }
    }, [showToast])


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
        showToast("Filters cleared")
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
                    {!isVendor && (
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
                                            
                                        <div className="h-40 relative overflow-hidden">
                                            {booking.vendorId.image ? (

                                                <img
                                                    src={booking.vendorId.image}
                                                    alt={booking.vendorId.name}
                                                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                                                />
                                            ) : (

                                                <div className="relative h-50 w-98 overflow-hidden rounded-xl bg-[#C2A886] shadow-lg">
                                                    <div className="absolute inset-0 bg-gradient-to-br from-[#4A0404]/40 via-transparent to-[#4A0404]/20"></div>
                                                
                                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(248,244,227,0.3)_0%,transparent_80%)]"></div>
                                            
                                                    <div className="absolute inset-x-0 top-0 h-px bg-white/20"></div>
                                                
                                                    <div className="relative flex h-full flex-col items-center justify-center">
                                                        <div className="text-[#4A0404]/70 drop-shadow-sm">
                                                                                                                    
                                                            <Bookmark size={60} strokeWidth={1.2} />
                                                
                                                        </div>
                                                                                                                
                                                        <div className="mt-4 flex flex-col items-center">
                                                            <div className="h-px w-20 bg-gradient-to-r from-transparent via-[#4A0404]/30 to-transparent"></div>
                                                                                                                    
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold uppercase
                                                                ${getStatusBadgeClass(booking.status)}
                                                            `}>
                                                    
                                                    {getStatusLabel(booking.status)}
                                            </div>
                                        </div>

                                        <div className="p-5">
                                            <h3 className="text-lg font-semibold text-[#0A0A0A]/90 capitalize mb-4 line-clamp-1">
                                                
                                                {booking.eventId.title}

                                            </h3>

                                            <p className="text-sm text-[#0A0A0A]/80 mb-3">

                                                <strong>Vendor:</strong> {booking.vendorId.name}
                                            </p>

                                            <div className="space-y-3 text-sm text-[#0A0A0A]/80 mb-4">

                                                <p><strong>Date:</strong> {formatDate(booking.eventId.date)}</p>
                                                <p><strong>Location:</strong> {booking.eventId.location}</p>

                                            </div>

                                            {booking.notes && (
                                                <p className="text-sm text-[#0A0A0A]/70 italic mb-5 line-clamp-2">
                                                    "{booking.notes}"
                                                </p>
                                            )}


                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {booking.status === "PENDING" &&  (isAdmin || isVendor) && (
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

                                                {booking.status === "CONFIRMED" && (isVendor || isAdmin) && (
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
                                            {(isAdmin || booking.userId === currentUserId) && !isVendor && (
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
            {isCreateModalOpen && !isVendor && (
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
                {/* Event Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Event
                  </label>
                  <select
                    value={selectedEventId}
                    onChange={(e) => {
                      setSelectedEventId(e.target.value);
                      setSelectedExtraItems([]); // Reset extras when event changes
                    }}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Select an event</option>
                    {events.map((event) => (
                      <option key={event._id} value={event._id}>
                        {event.title} — {formatDate(event.date)} ({event.location})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Vendor Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vendor
                  </label>
                  <select
                    value={selectedVendorId}
                    onChange={(e) => setSelectedVendorId(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Select a vendor</option>
                    {vendors.map((vendor) => (
                      <option key={vendor._id} value={vendor._id}>
                        {vendor.name} ({vendor.category})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Extra Items + Total Price */}
                {selectedEventId && (() => {
                  const selectedEvent = events.find((e) => e._id === selectedEventId);
                  if (!selectedEvent) return null;

                  const extraTotal = selectedExtraItems.reduce(
                    (sum, item) => sum + item.unitPrice * item.quantity,
                    0
                  );
                  const totalPrice = selectedEvent.basePrice + extraTotal;

                  return (
                    <>
                      {/* Extra Items */}
                      {selectedEvent.extraItems && selectedEvent.extraItems.length > 0 && (
                        <div className="space-y-4">
                          <label className="block text-sm font-medium text-gray-700">
                            Extra Items (Optional)
                          </label>
                          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                            {selectedEvent.extraItems.map((item) => {
                              const isSelected = selectedExtraItems.some((i) => i.name === item.name);
                              const qty =
                                selectedExtraItems.find((i) => i.name === item.name)?.quantity || 1;

                              return (
                                <div
                                  key={item.name}
                                  className="flex items-center justify-between"
                                >
                                  <div className="flex items-center gap-3">
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setSelectedExtraItems((prev) => [
                                            ...prev,
                                            { ...item, quantity: 1 },
                                          ]);
                                        } else {
                                          setSelectedExtraItems((prev) =>
                                            prev.filter((i) => i.name !== item.name)
                                          );
                                        }
                                      }}
                                      className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
                                    />
                                    <span className="text-sm font-medium">{item.name}</span>
                                    <span className="text-sm text-gray-600">
                                      ${item.unitPrice.toFixed(2)} each
                                    </span>
                                  </div>

                                  {isSelected && (
                                    <div className="flex items-center gap-2">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setSelectedExtraItems((prev) =>
                                            prev.map((i) =>
                                              i.name === item.name
                                                ? { ...i, quantity: Math.max(1, qty - 1) }
                                                : i
                                            )
                                          )
                                        }
                                        className="w-8 h-8 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                                      >
                                        −
                                      </button>
                                      <span className="w-12 text-center font-medium">{qty}</span>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setSelectedExtraItems((prev) =>
                                            prev.map((i) =>
                                              i.name === item.name ? { ...i, quantity: qty + 1 } : i
                                            )
                                          )
                                        }
                                        className="w-8 h-8 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                                      >
                                        +
                                      </button>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Price Summary */}
                      <div className="border-t pt-6 -mx-8 px-8 bg-gray-50">
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span>Base Price</span>
                            <span className="font-medium">
                              ${selectedEvent.basePrice.toFixed(2)}
                            </span>
                          </div>
                          {extraTotal > 0 && (
                            <div className="flex justify-between text-sm">
                              <span>Extra Items</span>
                              <span className="font-medium">${extraTotal.toFixed(2)}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-xl font-bold text-red-800 pt-4 border-t">
                            <span>Total Estimated Cost</span>
                            <span>${totalPrice.toFixed(2)}</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-3">
                          Final amount will be confirmed by the vendor.
                        </p>
                      </div>
                    </>
                  );
                })()}

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    placeholder="Special requests, timing, setup details..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={creating || !selectedEventId || !selectedVendorId}
                    className="flex-1 px-6 py-3 bg-red-800 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-70 transition-all"
                  >
                    {creating ? "Creating..." : "Create Booking"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-6 py-3 border border-gray-400 rounded-lg hover:bg-gray-100 transition-all"
                  >
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