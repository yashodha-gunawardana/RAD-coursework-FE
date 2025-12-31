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
    const handleDeleteVendor = useCallback(async (id: string, name: string) => {
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


    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F8F5F0] to-[#E8E3D8] p-5 md:p-10">

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

            <div className="max-w-7xl mx-auto">

                {/* header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 
                                    pb-6 border-b border-gray-200">

                    <div>
                        <h1 className="text-3xl md:text-6xl font-bold text-[#8B0000]/80 font-[poppins]">
              
                            Vendor Dashboard
                        </h1>

                        <p className="text-[#0F0F0F]/80 leading-relaxed text-l mt-1">
                            Professional Vendor Management System
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate("/dashboard/vendors/create")}
                            className="px-6 py-3 bg-gradient-to-r from-red-800 to-red-600 text-white rounded-lg font-semibold 
                                        hover:shadow-lg transition-all flex items-center gap-2 hover:-translate-y-0.5">
                                                
                                <Plus size={18} />
                                                    
                                    Add Vendor
                        </button>
                    </div>
                </header>

                {/* stats cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-[#F5F5F5] to-[#8B0000]/20 rounded-xl p-6 shadow-md border border-[#8B0000]/10 hover:shadow-lg transition-all 
                                    hover:-translate-y-1">
                        
                        <div className="flex justify-between items-center mb-4">
                            <div className="text-sm font-semibold text-[#0A0A0A] uppercase tracking-wide">Total Vendors</div>
                            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                                
                                <Calendar className="text-red-800" size={24} />

                            </div>
                        </div>

                        <div className="text-3xl font-bold text-gray-900 mb-2">{stats.totalVendors}</div>
                        <div className="text-sm text-green-600 font-medium flex items-center gap-1">
                            
                            <TrendingUp size={16} />

                                12% from last month
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#F5F5F5] to-[#8B0000]/20 rounded-xl p-6 shadow-md border border-[#8B0000]/10 hover:shadow-lg transition-all 
                                    hover:-translate-y-1">

                            <div className="flex justify-between items-center mb-4">
                                <div className="text-sm font-semibold text-[#0A0A0A] uppercase tracking-wide">Available Vendors</div>
                                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                                    
                                    <CheckCircle className="text-green-600" size={24} />

                                </div>
                            </div>

                            <div className="text-3xl font-bold text-gray-900 mb-2">{stats.availableVendors}</div>
                            <div className="text-sm text-green-600 font-medium flex items-center gap-1">
                        
                                <TrendingUp size={16} />

                                    {stats.availableVendors} ready to book
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#F5F5F5] to-[#8B0000]/20 rounded-xl p-6 shadow-md border border-[#8B0000]/10 hover:shadow-lg transition-all 
                                    hover:-translate-y-1">
                        
                        <div className="flex justify-between items-center mb-4">
                            <div className="text-sm font-semibold text-[#0A0A0A] uppercase tracking-wide">Categories</div>
                            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                                
                                <Clock className="text-blue-600" size={24} />

                            </div>
                        </div>

                        <div className="text-3xl font-bold text-gray-900 mb-2">{stats.totalCategories}</div>
                        <div className="text-sm text-red-600 font-medium flex items-center gap-1">
                            
                            <TrendingDown size={16} />

                                {stats.totalCategories} services
                        </div>
                    </div>
                </div>

                {/* main content */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                    <div className="px-6 py-6 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start 
                                    md:items-center gap-4">

                        <div>
                            <h2 className="text-2xl font-bold text-[#8B0000]/80 font-serif">Vendor Management</h2>
                            <p className="text-[#0F0F0F]/80 leading-relaxed text-[13px] mt-1">Browse and manage all vendors</p>
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

                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />

                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search vendors by name, contact, or description..."
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2
                                                focus:ring-red-500 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 w-full md:w-auto">
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2
                                            focus:ring-red-500 focus:border-transparent transition-all min-w-[160px]">

                                <option value="">All Categories</option>
                                <option value="PHOTOGRAPY">Photography</option>
                                <option value="CATERING">Catering</option>
                                <option value="DECORATION">Decoration</option>
                                <option value="DJ">DJ</option>
                                <option value="VENUE">Venue</option>
                                <option value="MAKEUP">Makeup</option>
                                <option value="FLORIST">Florist</option>
                                <option value="OTHER">Other</option>
                            </select>

                            <select
                                value={availabilityFilter}
                                onChange={(e) => setAvailabilityFilter(e.target.value)}
                                className="px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2
                                            focus:ring-red-500 focus:border-transparent transition-all min-w-[160px]">

                                <option value="">All Status</option>
                                <option value="true">Available</option>
                                <option value="false">Unavailable</option>
                            </select>
                        </div>
                    </div>

                    {/* vendor list */}
                    <div className="p-6">
                        {loading ? (

                            <div className="flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-800"></div>
                            </div>

                        ) : filteredVendors.length === 0 ? (

                            <div className="text-center py-12">

                                <Calendar className="text-gray-300 mx-auto mb-4" size={64} />

                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    {searchTerm || categoryFilter || availabilityFilter
                                        ? 'No Vendors Match Your Filters'
                                        : 'No Vendors Found'
                                    }
                                </h3>

                                <p className="text-gray-600 max-w-md mx-auto mb-6">
                                    {searchTerm || categoryFilter || availabilityFilter
                                        ? 'Try adjusting your search or filter criteria.'
                                        : 'Get started by adding your first vendor to the directory.'}
                                </p>

                                <button
                                    onClick={() => navigate("/dashboard/vendors/create")}
                                    className="px-6 py-3 bg-gradient-to-r from-red-800 to-red-600 text-white rounded-lg font-semibold
                                                hover:shadow-lg transition-all inline-flex items-center gap-2">
                  
                                        <Plus size={18} />
                  
                                            Add Your First Vendor
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                                {filteredVendors.map((vendor) => (
                                    <div
                                        key={vendor._id}
                                        className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm
                                                    hover:shadow-lg transition-all hover:-translate-y-1">

                                        <div className="h-40 bg-gradient-to-r from-red-800 to-red-600 relative">
                                            <div className="absolute top-4 left-4 bg-white/90 text-red-800 px-3 py-1 rounded-full text-xs
                                                        font-semibold uppercase tracking-wide">
                                            
                                                {getCategoryLabel(vendor.category)}
                                        
                                            </div>
                                        
                                            <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold
                                                                ${getAvailabilityClass(vendor.isAvailable)}
                                                            `}>
                                            
                                                {vendor.isAvailable ? 'Available' : 'Unavailable'}
                                            
                                            </div>
                                        
                                            {vendor.image && (
                                                <img
                                                    src={vendor.image}
                                                    alt={vendor.name}
                                                    className="absolute inset-0 w-full h-full object-cover opacity-20"
                                                />
                                            )}
                                        </div>

                                        {/* content */}
                                        <div className="p-5">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">

                                                {vendor.name}

                                            </h3>
                                            <div className="space-y-3 mb-4">
                                                <div className="flex items-start gap-2 text-gray-600">

                                                    <Calendar size={16} className="mt-0.5 flex-shrink-0 text-red-800" />

                                                    <div>
                                                        <div className="font-medium">
                                
                                                            {new Date(vendor.createdAt).toLocaleDateString()}
                                                        
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-2 text-gray-600">

                                                    <Eye size={16} className="mt-0.5 flex-shrink-0 text-red-800" />
                                                    <span className="line-clamp-1">{vendor.contact}</span>

                                                </div>

                                                {vendor.description && (
                                                    <div className="flex items-start gap-2 text-gray-600">
                                                        
                                                        <AlertCircle size={16} className="mt-0.5 flex-shrink-0 text-red-800" />
                                                        <span className="line-clamp-2">{vendor.description}</span>

                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex justify-between items-center mb-4">
                                                <div className="text-xl font-bold text-red-800">
                                                
                                                    {formatPriceRange(vendor.priceRange)}

                                                </div>
                                            </div>

                                            {/* action button */}
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => navigate(`/dashboard/vendors/edit/${vendor._id}`)}
                                                    className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium
                                                                hover:bg-gray-50 transition-all flex items-center justify-center gap-1">

                                                        <Edit size={16} />
                                                            
                                                            Edit
                                                </button>

                                                <button
                                                    onClick={() => viewVendorDetails(vendor)}
                                                    className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium
                                                                hover:bg-gray-50 transition-all flex items-center justify-center gap-1">
                                                        
                                                        <Eye size={16} />
                                                    
                                                            View
                                                </button>

                                                <button
                                                    onClick={() => handleDeleteVendor(vendor._id, vendor.name)}
                                                    className="flex-1 px-3 py-2 bg-red-100 text-red-800 rounded-lg font-medium hover:bg-red-800
                                                                hover:text-white transition-all flex items-center justify-center gap-1">
                                                    
                                                        <Trash2 size={16} />
                                                    
                                                            Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}


export default VendorPage