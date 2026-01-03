import React, { useCallback, useState } from "react";
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

    const [booking, setBookings] = useState<Booking[]>([])
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

            const response = await 
        } catch (err) {

        }
    })
}