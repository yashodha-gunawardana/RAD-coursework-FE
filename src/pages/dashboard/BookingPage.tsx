import React from "react";
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
    CONFIRMED: "CONFERMED",
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