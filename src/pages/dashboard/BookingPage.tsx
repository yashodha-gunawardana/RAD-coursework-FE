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
} from "react-feather";
import { getMyBooking, updateBooking, deleteBooking } from "../../services/booking";


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

    const [bookings, setBookings] = useState<Booking[]>([])
    const [loading, setLoading] = useState(true)
    const [toast, setToast] = useState<ToastState>({ show: false, message: "", type: "success" })

    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("")


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

            const response = await getMyBooking()
            setBookings(response.data || [])

        } catch (err : any) {
            console.error("Error loading bookings:", err)
            showToast("Failed to load bookings", "error")
        
        } finally {
            setLoading(false)
        }
    }, [showToast])


    // booking status update
    const handleStatusChange = useCallback(async (id: string, status: BookingStatusType) => {
        try {
            await updateBooking(id, { status })
            setBookings((prev) => prev.map((b) => (b._id === id ? { ...b, status } : b)))

            showToast(`Booking ${status.toLocaleLowerCase()} successfully`)

        } catch (err: any) {
            showToast("Failed to update booking statys", "error")
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
        showToast("Showing all bookings")
    }, [showToast])


    useEffect(() => {
        loadBookings()
    }, [loadBookings])
}