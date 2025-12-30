import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronLeft,
  Clipboard,
  CheckCircle,
  AlertCircle,
  Image as ImageIcon,
  Trash2,
  Check,
} from "react-feather";
import { createVendor, updateVendor, getvendorById } from "../services/vendor";


export const VendorCategory = {
    PHOTOGRAPY: "PHOTOGRAPY",
    CATERING: "CATERING",
    DECORATION: "DECORATION",
    DJ: "DJ",
    VENUE: "VENUE",
    MAKEUP: "MAKEUP",
    FLORIST: "FLORIST",
    OTHER: "OTHER"
} as const;

export type VendorCategory = typeof VendorCategory[keyof typeof VendorCategory]

interface VendorFormData {
    name: string;
    category: VendorCategory | "";
    contact: string;
    priceRange: string;
    description?: string;
    image: File | null;
    isAvailable: boolean;
}

interface ToastState {
    show: boolean;
    message: string;
    type: "success" | "error";
}

const VendorForm: React.FC = () => {
    const { id: editId } = useParams<{ id?: string }>()
    const navigate = useNavigate()

    const [formData, setFormData] = useState<VendorFormData>({
        name: "",
        category: "",
        contact: "",
        priceRange: "",
        description: "",
        image: null,
        isAvailable: true
    })

    const [preview, setPreview] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [toast, setToast] = useState<ToastState>({ show: false, message: "", type: "success" })

}