import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
    Plus,
    Calendar,
    CheckCircle,
    Clock,
    Filter,
    Search,
    Edit,
    Eye,
    Trash2,
    TrendingUp,
    TrendingDown,
    AlertCircle,
    ArrowRight,
    ArrowLeft,
    DollarSign
} from "react-feather";
import { getAllVendors, deleteVendor } from "../../services/vendor";
import { useAuth } from "../../context/authContext"; 


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
    addedBy?: string;
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
        ? "bg-green-100 text-green-800 border border-green-300"
        : "bg-red-100 text-red-800 border border-red-300"
}


const VendorPage: React.FC = () => {
    const navigate = useNavigate()

    const { user } = useAuth()
    const isAdmin = user?.roles.includes("ADMIN")
    const isVendor = user?.roles.includes("VENDOR")

    const [vendors, setVendors] = useState<Vendor[]>([])
    const [allVendors, setAllVendors] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(true)
    const [toast, setToast] = useState<ToastState>({ show: false, message: "", type: "success" })

    const [searchTerm, setSearchTerm] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("")
    const [availabilityFilter, setAvailabilityFilter] = useState("")
    const [loadingStats, setLoadingStats] = useState(false)
    
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalItems, setTotalItems] = useState(0)
    const limit = 6


    // toast notification
    const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast(prev => ({ ...prev, show: false }));
        }, 3000);
    }, []);


    // load all vendors
    const loadVendors = useCallback(async (pageNumber: number = 1) => {
        try {
            setLoading(true)
            const response = await getAllVendors({
                page: pageNumber,
                limit,
                search: searchTerm || undefined,
                category: categoryFilter || undefined,
                isAvailable: availabilityFilter ? availabilityFilter === "true" : undefined
            })  

            setVendors(response.data || [])
            setTotalPages(response.totalPages || 1)
            setTotalItems(response.totalItems || 0) 
            setPage(pageNumber)
        
        } catch (err : any) {
            console.error("Error loading vendors: ", err)
            showToast("Failed to load vendors", "error")
        
        } finally {
            setLoading(false)
        }
    }, [searchTerm, categoryFilter, availabilityFilter, showToast])


    const loadAllVendorsForStats = useCallback(async () => {
        try {
            setLoadingStats(true)
            const response = await getAllVendors({  limit: 1000 }); // large limit to get all
            setAllVendors(response.data || []);
        } catch (err) {
            console.error("Error loading all vendors:", err);
        
        } finally {
            setLoadingStats(false)
        }
    }, [])
        

    // delete vendor
    const handleDeleteVendor = useCallback(async (id: string, name: string) => {
        if (!confirm(`Delete "${name}"? This cannot be undone`))
            return

        try {
            await deleteVendor(id)
    
            showToast("Vendor deleted successfully..")

            loadVendors(page)
            loadAllVendorsForStats()
        
        } catch (err: any) {
            console.error("Deleted failedd: ", err)
            showToast(err?.response?.data?.message || "Failed to delete vendor", "error")
        }
    }, [page, loadVendors, showToast, loadAllVendorsForStats])


    // stats card
    const stats = React.useMemo(() => {
        const totalVendors = allVendors.length;
        const availableVendors = allVendors.filter(v => v.isAvailable).length;
        const totalCategories = new Set(allVendors.map(v => v.category)).size;

        return {
            totalVendors,
            availableVendors,
            totalCategories
        }
    }, [allVendors]);


    // rest filters
    const resetFilters = useCallback(() => {
        setSearchTerm("");
        setCategoryFilter("");
        setAvailabilityFilter("");
        setPage(1)
        showToast("Filters cleared");
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
        loadVendors(page)
    }, [page, loadVendors])


    // load all events once for stats
    useEffect(() => {
        loadAllVendorsForStats();
    }, [loadAllVendorsForStats])
    
    
    // reset page when filters change
    useEffect(() => {
        setPage(1);
    }, [searchTerm, categoryFilter, availabilityFilter])
    


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

                    {isAdmin && (
                        <div className="flex gap-3">
                            <button
                                onClick={() => navigate("/dashboard/vendors/create")}
                                className="px-6 py-3 bg-gradient-to-r from-red-800 to-red-600 text-white rounded-lg font-semibold 
                                            hover:shadow-lg transition-all flex items-center gap-2 hover:-translate-y-0.5">
                                                    
                                    <Plus size={18} />
                                                        
                                        Add Vendor
                            </button>
                        </div>
                    )}
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

                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black" size={18} />

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
                                <option value="PHOTOGRAPHY">Photography</option>
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

                        ) : vendors.length === 0 ? (

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

                                {isAdmin && (
                                    <button
                                        onClick={() => navigate("/dashboard/vendors/create")}
                                        className="px-6 py-3 bg-gradient-to-r from-red-800 to-red-600 text-white rounded-lg font-semibold
                                                    hover:shadow-lg transition-all inline-flex items-center gap-2">
                    
                                            <Plus size={18} />
                    
                                                Add Your First Vendor
                                    </button>
                                )}
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                                    {vendors.map((vendor) => (

                                        <div
                                            key={vendor._id}
                                            className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm
                                                        hover:shadow-lg transition-all hover:-translate-y-1">

                                                {/* form image as cover photo */}
                                                <div className="h-40 relative overflow-hidden">
                                                    {vendor.image ? (
                                                        <div
                                                            className="w-full h-full bg-cover bg-center opacity-80"
                                                            style={{ backgroundImage: `url(${vendor.image})` }}
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
                                                        
                                                        {getCategoryLabel(vendor.category)}
                                                    </div>

                                                    {/* availability Badge */}
                                                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold uppercase
                                                                    ${getAvailabilityClass(vendor.isAvailable)}`}>
                                                        
                                                        {vendor.isAvailable ? 'Available' : 'Unavailable'}
                                                    </div>
                                                </div>

                                                {/* content */}
                                                <div className="p-5">
                                                    <h3 className="text-lg font-semibold mb-4 line-clamp-2 capitalize">

                                                        {/* {vendor.name.charAt(0).toUpperCase() + vendor.name.slice(1)} */}
                                                        {vendor.name}

                                                    </h3>

                                                    <div className="space-y-3 mb-5 text-[#0A0A0A]/90">
                                                        <div className="flex items-start gap-3">

                                                            <Calendar size={16} className="mt-1.5 flex-shrink-0 text-red-800" />

                                                            <div>
                                                                <div className="font-lg">
                                        
                                                                    {new Date(vendor.createdAt).toLocaleDateString()}
                                                                
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-start gap-3">

                                                            <Eye size={16} className="mt-1 flex-shrink-0 text-red-800" />
                                                            <span className="line-clamp-1 font-lg">{vendor.contact}</span>

                                                        </div>

                                                        {vendor.description && (
                                                            <div className="flex items-start gap-3">
                                                                
                                                                <AlertCircle size={16} className="mt-1 flex-shrink-0 text-red-800" />
                                                                <span className="line-clamp-2 font-lg">{vendor.description}</span>

                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex items-start gap-2">
                                                        
                                                        <DollarSign className="mt-2 flex-shrink-0 text-red-800" size={20} />
                                                        <span className="line-clamp-1 font-bold text-2xl text-red-800">
                                                            
                                                            {formatPriceRange(vendor.priceRange)}
                                                        </span>

                                                    </div> 

                                                    {/* action button */}
                                                    <div className="flex gap-2 mt-5">
                                                        {(isAdmin || (isVendor && vendor.addedBy === user?._id)) && (
                                                            <button
                                                                onClick={() => navigate(`/dashboard/vendors/edit/${vendor._id}`)}
                                                                className="flex-1 px-3 py-2 bg-yellow-100 border border-yellow-300 text-yellow-700 rounded-lg font-medium
                                                                            hover:bg-gray-50 transition-all flex items-center justify-center gap-1">

                                                                    <Edit size={16} />
                                                                        
                                                                        Edit
                                                            </button>
                                                        )}

                                                        <button
                                                            onClick={() => viewVendorDetails(vendor)}
                                                            className="flex-1 px-3 py-2 bg-blue-100 border border-blue-300 text-blue-700 rounded-lg font-medium
                                                                        hover:bg-gray-50 transition-all flex items-center justify-center gap-1">
                                                                
                                                                <Eye size={16} />
                                                            
                                                                    View
                                                        </button>
                                                        
                                                        {isAdmin && (
                                                            <button
                                                                onClick={() => handleDeleteVendor(vendor._id, vendor.name)}
                                                                className="flex-1 px-3 py-2 bg-red-100 border border-red-300 text-red-800 rounded-lg font-medium hover:bg-red-50
                                                                            hover:text-red transition-all flex items-center justify-center gap-1">
                                                                
                                                                    <Trash2 size={16} />
                                                                
                                                                        Delete
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                        </div>
                                    ))}
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
                                                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                                                disabled={page === 1}
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
                                                onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                                                disabled={page === totalPages}
                                                className="group flex items-center gap-2 rounded-full border border-[#D9B99B]/50 
                                                            bg-[#4A0404]/5 px-6 py-2 text-[#4A0404] transition-all duration-300
                                                            hover:bg-[#4A0404] hover:text-[#F8F4E3] hover:shadow-[0_0_20px_rgba(74,4,4,0.2)]
                                                            active:scale-95
                                                            disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent">
                                                                                
                                                    <span className="text-sm font-semibold tracking-widest uppercase">
                                                                                    
                                                        Next
                                                    </span>
                                                                            
                                                    <div className="relative flex h-5 w-5 items-center justify-center rounded-full bg-[#4A0404]/10 group-hover:bg-[#F8F4E3]/20">
                                                                                    
                                                        <ArrowRight  size={14} strokeWidth={3} className="transition-transform group-hover:translate-x-0.5" />
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


export default VendorPage