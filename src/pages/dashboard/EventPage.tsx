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
  AlertCircle
} from "react-feather";
import { getMyEvents, deleteEvent } from "../../services/events";


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
    createdAt: string;
    updatedAt: string;
}

interface ToastState {
    show: boolean
    message: string
    type: "success" | "error"
}

const eventType = {
    WEDDING: "WEDDING",
    BIRTHDAY: "BIRTHDAY",
    CONFERENCE: "CONFERENCE",
    CORPORATE: "CORPORATE",
    PARTY: "PARTY",
    OTHER: "OTHER"
} as const;

const EventStatus = {
    PLANNING: "PLANNING",
    ONGOING: "ONGOING",
    COMPLETED: "COMPLETED",
    CANCELLED: "CANCELLED"
} as const;


const EventsPage: React.FC = () => {
    const navigate = useNavigate()

    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)
    const [toast, setToast] = useState<ToastState>({ show: false, message: " ", type: "success" })

    const [searchTerm, setSearchTerm] = useState("")
    const [typeFilter, setTypeFilter] = useState("")
    const [statusFilter, setStatusFilter] = useState("")


    const calculateTotalprice = useCallback((event: Event) => {
        let total = event.basePrice || 0

        if (event.extraItems && event.extraItems.length > 0) {
            event.extraItems.forEach(item => {
                total += (item.unitPrice || 0) * (item.quantity || 1)
            })
        }
        return total

    }, []);
}