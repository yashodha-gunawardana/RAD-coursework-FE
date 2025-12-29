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

    
    // calculate total price
    const calculateTotalprice = useCallback((event: Event) => {
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
            WEDDING: "WEDDING",
            BIRTHDAY: "BIRTHDAY",
            CONFERENCE: "CONFERENCE",
            CORPORATE: "CORPORATE",
            PARTY: "PARTY",
            OTHER: "OTHER"
        }
        return labels[type] || type
    }, [])


    // status badge
    const getStatusClass = useCallback((status: string) => {
        const classes: Record<string, string> = {
            "PLANING": "bg-blue-100 text-blue-800 border border-blue-200",
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


    // get event handler
    const loadEvents = useCallback(async () => {
        try {
            setLoading(true)
            const response = await getMyEvents()
            setEvents(response.data || [])
        
        } catch (err: any) {
            console.error("Error loading events: ", err)
            showToast("Failed to load events", err)
        
        } finally {
            setLoading(false)
        }
    }, [showToast])


    // delete handler
    const handleDeleteEvent = useCallback(async (id: string, title: string) => {
        if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
            return
        }

        try {
            await deleteEvent(id)
            setEvents(prev => prev.filter(event => event._id !== id))
            showToast("Event deleted successfully..")
        
        } catch (err: any) {
            console.error("Error deleting event: ", err)
            showToast("Failed to delete event", "error")
        }
    }, [showToast])


    // dashboard statistics
    const stats = React.useMemo(() => {
        const totalEvents = events.length
        const activeEvents = events.filter(e => e.status === EventStatus.ONGOING).length
        const totalRevenue = events.reduce((sum, event) => sum + calculateTotalprice(event), 0)

        // within next 30 days from today
        const today = new Date()
        const nextMonth = new Date()
        nextMonth.setDate(today.getDate() + 30)
        
        const upcomingEvents = events.filter(e => {
            const eventDate = new Date(e.date)
            return eventDate > today && eventDate <= nextMonth
        }).length

        return { totalEvents, activeEvents, upcomingEvents, totalRevenue }
    }, [events, calculateTotalprice])


    // filter
    const filteredEvents = React.useMemo(() => {
        let result = [...events];

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(event =>
                event.title.toLowerCase().includes(term) ||
                event.location.toLowerCase().includes(term) ||
                (event.description && event.description.toLowerCase().includes(term))
            );
        }

        if (typeFilter) {
            result = result.filter(event => event.type === typeFilter);
        }

        if (statusFilter) {
            result = result.filter(event => event.status === statusFilter);
        }

        // sort by most recent date first
        return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }, [events, searchTerm, typeFilter, statusFilter])


    // filter reset
    const resetFilters = useCallback(() => {
        setSearchTerm('');
        setTypeFilter('');
        setStatusFilter('');
        showToast('Showing all events');
    }, [showToast]);


    // full details view
    const viewEventDetails = useCallback((event: Event) => {
        const totalPrice = calculateTotalprice(event)
        let details = `Event Details:\n\n`
        details += `Title: ${event.title}\n`
        details += `Type: ${getEventTypeLabel(event.type)}\n`
        details += `Date: ${formatDate(event.date)}${event.time ? `at ${event.time}` : ``}\n`
        details += `Location: ${event.location}\n`
        details += `Status: ${event.status}\n`
        details += `Base Price: ${formatCurrency(event.basePrice)}\n`
        details += `Total Price: ${formatCurrency(totalPrice)}\n\n`

        if (event.description) {
            details += `Description: ${event.description}\n\n`
        }

        if (event.extraItems && event.extraItems.length > 0) {
            details += `Extra Items:\n`
            event.extraItems.forEach(item => {
                const quantity = item.quantity || 1
                details += `• ${item.name}: ${formatCurrency(item.unitPrice)} × ${quantity} = ${formatCurrency(item.unitPrice * quantity)}\n`
            })
        }
        alert(details)
    }, [calculateTotalprice, getEventTypeLabel])


    useEffect(() => {
        loadEvents()
    }, [loadEvents])


    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F8F5F0] to-[#E8E3D8] text-[#0A0A0A] p-5 md:p-10 
                        font-[poppins]">

            {/* toast notification */}
            {toast.show && (
                <div className={`fixed bottom-6 right-6 bg-white text-gray-900 px-6 py-4 rounded-xl shadow-lg z-50
                                    animate-slideIn flex items-center gap-3 
                                    ${toast.type === "success" ? "border-l-4 border-green-500" : "border-l-4 border-red-500"}
                                `}>

                    {toast.type === "success" ? (
                        <AlertCircle className="text-green-500" size={20} />
                    ) : (
                        <AlertCircle className="text-red-500" size={20} />
                    )}
                    
                    <span>{toast.message}</span>
                    
                </div>
            )}

        </div>
    )
}