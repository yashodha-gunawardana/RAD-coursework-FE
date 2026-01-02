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