import React, { useEffect, useState, useCallback} from "react";
import {
  User,
  CheckCircle,
  XCircle,
  Filter,
  Search,
  Trash2,
  TrendingUp,
  Users,
  Shield,
  Clock,
} from "react-feather";
import { getAllUsers, approveVendorRequest, rejectVendorRequest } from "../../services/auth";


export const Role = {
    ADMIN: "ADMIN",
    VENDOR: "VENDOR",
    USER: "USER"
} as const


export const VendorStatus = {
    NOT_REQUESTED: "NOT_REQUESTED",
    PENDING: "PENDING",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED"
} as const


export type RoleType = typeof Role[keyof typeof Role]
export type VendorStatusType = typeof VendorStatus[keyof typeof VendorStatus]


interface AppUser {
    _id: string,
    fullname: string,
    email: string,
    roles: RoleType[],
    vendorStatus: VendorStatusType,
    createdAt: string
}

interface ToastState {
    show: boolean
    message: string
    type: "success" | "error"
}

// role badge
const getRoleBadgeClass = (role: RoleType): string => {
    switch (role) {
        case "ADMIN":
            return "bg-purple-100 text-purple-800 border border-purple-200"

        case "VENDOR":
            return "bg-orange-100 text-orange-800 border border-orange-200"

        case "USER":
            return "bg-blue-100 text-blue-800 border border-blue-200"

        default:
            return "bg-gray-100 text-gray-800"
    }
}


// status badge
const getStatusBadgeClass = (status: VendorStatusType): string => {
    switch (status) {
        case "APPROVED":
            return "bg-green-100 text-green-800 border border-green-200"

        case "PENDING":
            return "bg-yellow-100 text-yellow-800 border border-yellow-200"

        case "REJECTED":
            return "bg-red-100 text-red-800 border border-red-200"

        case "NOT_REQUESTED":
        default:
            return "bg-gray-100 text-gray-800 border border-gray-300"
    }
}

// get role label
const getRoleLabel = (role: RoleType): string => {
    return role.charAt(0) + role.slice(1).toLowerCase()
}


// status label
const getStatusLabel = (status: VendorStatusType): string => {
    switch (status) {
        case "NOT_REQUESTED": 
            return "No Request"

        case "PENDING": 
            return "Pending"
        case "APPROVED": 
            return "Approved"

        case "REJECTED": 
            return "Rejected"

        default: 
            return status
    }
}


const UsersPage: React.FC = () => {
    const [users, setUsers] = useState<AppUser[]>([])
    const [loading, setLoading] = useState(true)
    const [toast, setToast] = useState<ToastState>({ show: false, message: "", type: "success"})

    const [searchTerm, setSearchTerm] = useState("")
    const [roleFilter, setRoleFilter] = useState<RoleType | "">("")
    const [statusFilter, setStatusFilter] = useState<VendorStatusType | "">("")



    const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
        setToast({ show: true, message, type })
        setTimeout(() => 
            setToast(
                { show: false, message: "", type: "success" }
            
        ), 3000)
    }, [])


    // load users
    const loadUsers = useCallback(async () => {
        try {
            setLoading(true)
            const response = await getAllUsers()
            
            setUsers(response.data || [])

        } catch (err: any) {
            console.error("Error loading users:", err)
            showToast("Failed to load users. Please refresh.", "error")

        } finally {
            setLoading(false)
        }
    }, [showToast])


    // approve vendor req
    const handleApprove = useCallback(async (userId: string) => {
        try {
            await approveVendorRequest(userId)
            setUsers(prev =>
                prev.map(u=> u._id === userId ? {
                    ...u, vendorStatus: "APPROVED" as VendorStatusType } : u)
            )
            showToast("Vendor approved successfully", "success")
        
        } catch (err: any) {
            showToast("Failed to approve vendor", "error")
        }
    }, [showToast])


    // reject vendor req
    const handleReject = useCallback(async (userId: string) => {
        try {
            await rejectVendorRequest(userId)
            setUsers(prev =>
                prev.map(u => u._id === userId ? {
                    ...u, vendorStatus: "REJECTED" as VendorStatusType } : u)
            )
            showToast("Vendor request rejected", "success")

        } catch (err: any) {
            showToast("Failed to reject vendor", "error")
        }
    }, [showToast])


    // stats cards
    const stats = React.useMemo(() => {
        const totalUsers = users.length
        const admins = users.filter(u => u.roles.includes("ADMIN")).length
        const vendors = users.filter(u => u.roles.includes("VENDOR")).length
        const pending = users.filter(u => u.vendorStatus.includes("PENDING")).length

        return {
            totalUsers,
            admins,
            vendors,
            pending
        }
    }, [users])


    // filters
    const filteredUsers = React.useMemo(() => {
        let result = [...users]

        if (searchTerm) {
            const term = searchTerm.toLowerCase()
            result = result.filter(
                u =>
                    u.fullname.toLowerCase().includes(term) ||
                u.email.toLowerCase().includes(term)
            )
        }

        if (roleFilter) {
            result = result.filter(u => u.roles.includes(roleFilter))
        }

        if (statusFilter) {
            result = result.filter(u => u.vendorStatus === statusFilter)
        }

        return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    
    }, [users, searchTerm, roleFilter, statusFilter])


    // reset
    const resetFilters = useCallback(() => {
        setSearchTerm("")
        setRoleFilter("")
        setStatusFilter("")
        showToast("Filters cleared")
    }, [showToast])



    useEffect(() => {
        loadUsers()
    }, [loadUsers])


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
                        <CheckCircle className="text-red-500" size={20} />
                    )}
            
                    <span>{toast.message}</span>
                </div>
            )}


            <div className="max-w-7xl mx-auto">

                {/* header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-gray-200">
                    <div>
                        <h1 className="text-3xl md:text-6xl font-bold text-[#8B0000]/80 font-[poppins]">
                            
                            Users Dashboard

                        </h1>

                        <p className="text-[#0F0F0F]/80 leading-relaxed text-l mt-1">
                            Professional User Management System
                        </p>
                    </div>
                </header>

                {/* stats card */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    
                    {/* total */}
                    <div className="bg-gradient-to-br from-[#F5F5F5] to-[#8B0000]/20 rounded-xl p-6 shadow-md border border-[#8B0000]/10 hover:shadow-lg 
                                    transition-all hover:-translate-y-1">
                            
                        <div className="flex justify-between items-center mb-4">
                            <div className="text-sm font-semibold text-[#0A0A0A] uppercase tracking-wide">
                                
                                Total Users
                            </div>

                            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                
                                <Users className="text-red-800" size={24} />

                            </div>
                        </div>

                        <div className="text-3xl font-bold text-gray-900 mb-2">{stats.totalUsers}</div>
                        <div className="text-sm text-green-600 font-medium flex items-center gap-1">
                        
                            <TrendingUp size={16} />
                                
                                Active platform users
                        </div>
                    </div>

                    {/* admins */}
                    <div className="bg-gradient-to-br from-[#F5F5F5] to-[#8B0000]/20 rounded-xl p-6 shadow-md border border-[#8B0000]/10 hover:shadow-lg 
                                    transition-all hover:-translate-y-1">
                        
                        <div className="flex justify-between items-center mb-4">
                            <div className="text-sm font-semibold text-[#0A0A0A] uppercase tracking-wide">
                                
                                Admins
                            </div>

                            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                                
                                <Shield className="text-purple-600" size={24} />

                            </div>
                        </div>

                        <div className="text-3xl font-bold text-gray-900 mb-2">{stats.admins}</div>
                        <div className="text-sm text-green-600 font-medium flex items-center gap-1">
                            
                            <TrendingUp size={16} />
                                
                                System administrators
                        </div>
                    </div>

                    {/* vendors */}
                    <div className="bg-gradient-to-br from-[#F5F5F5] to-[#8B0000]/20 rounded-xl p-6 shadow-md border border-[#8B0000]/10 hover:shadow-lg 
                                    transition-all hover:-translate-y-1">
                        
                        <div className="flex justify-between items-center mb-4">
                            <div className="text-sm font-semibold text-[#0A0A0A] uppercase tracking-wide">
                                
                                Vendors
                            </div>

                            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                                
                                <User className="text-orange-600" size={24} />

                            </div>
                        </div>

                        <div className="text-3xl font-bold text-gray-900 mb-2">{stats.vendors}</div>
                        <div className="text-sm text-green-600 font-medium flex items-center gap-1">
                            
                            <TrendingUp size={16} />
                        
                                Approved service providers
                        </div>
                    </div>

                    {/* pending */}
                    <div className="bg-gradient-to-br from-[#F5F5F5] to-[#8B0000]/20 rounded-xl p-6 shadow-md border border-[#8B0000]/10 hover:shadow-lg 
                                    transition-all hover:-translate-y-1">

                        <div className="flex justify-between items-center mb-4">
                            <div className="text-sm font-semibold text-[#0A0A0A] uppercase tracking-wide">
                                
                                Pending Approval
                            </div>

                            <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                                
                                <Clock className="text-yellow-600" size={24} />

                            </div>
                        </div>

                        <div className="text-3xl font-bold text-gray-900 mb-2">{stats.pending}</div>
                        <div className="text-sm text-yellow-600 font-medium flex items-center gap-1">
                            
                            <Clock size={16} />

                                Awaiting review
                        </div>
                    </div>
                </div>

                {/* main table */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                    <div className="px-6 py-6 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

                        <div>
                            <h2 className="text-2xl font-bold text-[#8B0000]/80 font-serif">User Management</h2>
                            <p className="text-[#0F0F0F]/80 leading-relaxed text-[13px] mt-1">Manage all registered users</p>
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
                                    placeholder="Search by name or email..."
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 
                                            focus:ring-red-500 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 w-full md:w-auto">
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value as RoleType | "")}
                                className="px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 
                                            focus:ring-red-500 focus:border-transparent transition-all min-w-[160px]">
                            
                                <option value="">All Roles</option>
                                <option value="ADMIN">Admin</option>
                                <option value="VENDOR">Vendor</option>
                                <option value="USER">User</option>
                            </select>

                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as VendorStatusType | "")}
                                className="px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 
                                            focus:ring-red-500 focus:border-transparent transition-all min-w-[160px]">
                            
                                <option value="">All Status</option>
                                <option value="NOT_REQUESTED">No Request</option>
                                <option value="PENDING">Pending</option>
                                <option value="APPROVED">Approved</option>
                                <option value="REJECTED">Rejected</option>
                            </select>
                        </div>
                    </div>

                    {/* users grid */}
                    <div className="p-6">

                        {loading ? (

                            <div className="flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-800"></div>
                            </div>

                        ) : filteredUsers.length === 0 ? (

                            <div className="text-center py-12">

                                <User className="text-gray-300 mx-auto mb-4" size={64} />
                
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    {searchTerm || roleFilter || statusFilter 
                                        ? "No Users Match Filters" 
                                        : "No Users Found"
                                    }
                                </h3>

                                <p className="text-gray-600 max-w-md mx-auto mb-6">
                                    Users will appear here once they register.
                                </p>
                            </div>

                        ) : (

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                                {filteredUsers.map((user) => (
                                    <div
                                        key={user._id}
                                        className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg 
                                                    transition-all hover:-translate-y-1">

                                        <div className="h-40 bg-gradient-to-r from-red-800 to-red-600 relative flex items-center justify-center">

                                            <User className="text-white/80" size={64} />

                                            {/* role badge */}
                                            <div className="absolute top-4 left-4 flex gap-2">
                                                {user.roles.map((role) => (
                                                
                                                    <span
                                                        // key={role}
                                                        key={`${user._id}-${role}`} 
                                                        className={`px-3 py-1 rounded-full text-xs font-semibold 
                                                                    ${getRoleBadgeClass(role)}
                                                                `}>
                                                    
                                                            {getRoleLabel(role)}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* status badge */}
                                            <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold 
                                                                ${getStatusBadgeClass(user.vendorStatus)}
                                                            `}>
                                                
                                                    {getStatusLabel(user.vendorStatus)}
                                            </div>
                                        </div>

                                        <div className="p-5">

                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                {user.fullname}
                                            </h3>

                                            <p className="text-sm text-gray-600 mb-4">
                                                {user.email}
                                            </p>


                                            {/* approve/reject buttons only for pending */}
                                            {user.vendorStatus === "PENDING" && (
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    <button
                                                        onClick={() => handleApprove(user._id)}
                                                        className="flex-1 px-3 py-2 bg-green-100 text-green-800 rounded-lg font-medium hover:bg-green-200 
                                                                    transition-all flex items-center justify-center gap-1">
                                                    
                                                            <CheckCircle size={16} />

                                                                Approve
                                                    </button>

                                                    <button
                                                        onClick={() => handleReject(user._id)}
                                                        className="flex-1 px-3 py-2 bg-red-100 text-red-800 rounded-lg font-medium hover:bg-red-200 
                                                                    transition-all flex items-center justify-center gap-1">
                                                    
                                                            <XCircle size={16} />
                                                        
                                                                Reject
                                                    </button>
                                                </div>
                                            )}

                                            {/* delete disabled until implemented */}
                                            <button
                                                disabled
                                                className="w-full px-3 py-2 bg-gray-100 text-gray-400 rounded-lg font-medium cursor-not-allowed flex 
                                                            items-center justify-center gap-1 opacity-50">
                                            
                                                    <Trash2 size={16} />
                                                
                                                        Delete User (Coming Soon)
                                            </button>
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


export default UsersPage
