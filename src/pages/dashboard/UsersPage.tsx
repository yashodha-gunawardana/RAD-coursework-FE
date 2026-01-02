import React, { useEffect, useState, useCallback} from "react";
import {
  User,
  CheckCircle,
  XCircle,
  Filter,
  Search,
  Trash2,
  AlertCircle,
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