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