import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { 
    Plus,
    Calendar,
    CheckCircle,
    Clock,
    DollarSign,
    Filter,
    Search,
    Edit,
    Eye,
    Trash2,
    TrendingUp,
    TrendingDown,
    AlertCircle
} from "react-feather";
import { getAllVendors, deleteVendor } from "../../services/vendor";


export const VendorCategory = {
    PHOTOGRAPHY: "PHOTOGRAPHY",
    CATERING: "CATERING",
    DECORATION: "DECORATION",
    DJ: "DJ",
    VENUE: "VENUE",
    MAKEUP: "MAKEUP",
    FLORIST: "FLORIST",
    OTHER: "OTHER"
} as const;

export type VendorCategoryType = typeof VendorCategory[keyof typeof VendorCategory]

interface Vendor {
    _id: string;
    name: string;
    category: VendorCategoryType;
    contact: string;
    priceRange: string;
    description?: string;
    image?: string;
    isAvailable: boolean;
    createdAt: string;
    updatedAt: string;
}

interface ToastState {
    show: boolean;
    message: string;
    type: "success" | "error";
}

const formatPriceRange = (priceRange: string): string => {
    return priceRange || "Price on request"
}

const getCategoryLabel = (category: VendorCategoryType): string => {
    const labels: Record<VendorCategoryType, string> = {
        PHOTOGRAPHY: "Photography",
        CATERING: "Catering",
        DECORATION: "Decoration",
        DJ: "Dj",
        VENUE: "Venue",
        MAKEUP: "Makeup Artist",
        FLORIST: "Florist",
        OTHER: "Other"
    }
    return labels[category] || category
}

const getAvailabilityClass = (isAvailable: boolean): string => {
    return isAvailable
        ? "bg-green-100 text-green-800 border border-green-200"
        : "bg-red-100 text-red-800 border border-red-200"
}


const VendorPage: React.FC = () => {
    const navigate = useNavigate()

    const [vendors, setVendors] = useState<Vendor[]>([])
    const [loading, setLoading] = useState(true)
    const [toast, setToast] = useState<ToastState>({ show: false, message: "", type: "success" })

    const [searchTerm, setSearchTerm] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("")
    const [availabilityFilter, setAvailabilityFilter] = useState("")


    // toast notification
    const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast(prev => ({ ...prev, show: false }));
        }, 3000);
    }, []);


    // load all vendors
    const loadVendors = useCallback(async () => {
        try {
            setLoading(true)
            const response = await getAllVendors()
            setVendors(response.data || [])
        
        } catch (err : any) {
            console.error("Error loading vendors: ", err)
            showToast("Failed to load vendors", err)
        
        } finally {
            setLoading(false)
        }
    }, [showToast])


    // delete vendor
    const handleDeleteVendors = useCallback(async (id: string, name: string) => {
        if (!confirm(`Delete "${name}"? This cannot be undone`))
            return

        try {
            await deleteVendor(id)
            setVendors(prev => prev.filter(vendor => vendor._id !== id))
            showToast("Vendor deleted successfully..")
        
        } catch (err: any) {
            console.error("Deleted failedd: ", err)
            showToast(err?.response?.data?.message || "Failed to delete vendor", "error")
        }
    }, [showToast])


    // stats card
    const stats = React.useMemo(() => {
        const totalVendors = vendors.length;
        const availableVendors = vendors.filter(v => v.isAvailable).length;
        const totalCategories = new Set(vendors.map(v => v.category)).size;

        return {
            totalVendors,
            availableVendors,
            totalCategories
        }
    }, [vendors]);


    // filters
    const filteredVendors = React.useMemo(() => {
        let result = [...vendors]

        // search by name, contact, description
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(vendor =>
                vendor.name.toLowerCase().includes(term) ||
                vendor.contact.toLowerCase().includes(term) ||
                (vendor.description && vendor.description.toLowerCase().includes(term))
            );
        }

        // category
        if (categoryFilter) {
            result = result.filter(vendor => vendor.category === categoryFilter);
        }

        // availability 
        if (availabilityFilter) {
            const available = availabilityFilter === "true";
            result = result.filter(vendor => vendor.isAvailable === available);
        }

        return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [vendors, searchTerm, categoryFilter, availabilityFilter]);
    

    // rest filters
    const resetFilters = useCallback(() => {
        setSearchTerm("");
        setCategoryFilter("");
        setAvailabilityFilter("");
        showToast("Showing all vendors");
    }, [showToast]);


    // full details popup
    const viewVendorDetails = useCallback((vendor: Vendor) => {
        let details = `Vendor Details:\n\n`;
        details += `Name: ${vendor.name}\n`;
        details += `Category: ${getCategoryLabel(vendor.category)}\n`;
        details += `Contact: ${vendor.contact}\n`;
        details += `Price Range: ${formatPriceRange(vendor.priceRange)}\n`;
        details += `Status: ${vendor.isAvailable ? 'Available' : 'Unavailable'}\n\n`;

        if (vendor.description) {
            details += `Description:\n${vendor.description}\n\n`;
        }

        details += `Added: ${new Date(vendor.createdAt).toLocaleDateString()}`;
        alert(details);
    }, []);


    useEffect(() =>{
        loadVendors()
    }, [loadVendors])
}