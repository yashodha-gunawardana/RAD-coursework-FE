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


    // toast notifi
    const showToast = (message: string, type: "success" | "error" = "success") => {
        setToast({ show: true, message, type })

        setTimeout(() => {
            setToast(prev => ({ ...prev, show: false }));
        }, 3000);
    }


    // handle input
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ 
            ...prev, [id]: value 
        }));
    }


    // image handler
    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData((prev) => ({ ...prev, image: file }));
            setPreview(URL.createObjectURL(file));
        }
    } 


    // loading data on edit mode
    useEffect(() => {
        if (editId) {
            const loadVendor = async () => {
                try {
                    setLoading(true)
                    const response = await getvendorById(editId)
                    const vendor = response.data

                    setFormData({
                        name: vendor.name,
                        category: vendor.category,
                        contact: vendor.contact,
                        priceRange: vendor.priceRange,
                        description: vendor.description || "",
                        image: null,
                        isAvailable: vendor.isAvailable
                    })

                    if (vendor.image) {
                        setPreview(vendor.image)
                    }

                } catch (err: any) {
                    showToast("Failed to load vendor details", "error")
                
                } finally {
                    setLoading(false)
                }
            } 
            loadVendor()
        }
    }, [editId])


    // handle submit form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.name || !formData.category || !formData.contact || !formData.priceRange) {
            showToast("Please fill all required fields", "error");
            return
        }

        const data = new FormData();
        data.append("name", formData.name);
        data.append("category", formData.category);
        data.append("contact", formData.contact);
        data.append("priceRange", formData.priceRange);
        if (formData.description) data.append("description", formData.description);
        if (formData.image) data.append("image", formData.image);
        data.append("isAvailable", String(formData.isAvailable));

        try {
            setLoading(true)

            if (editId) {
                await updateVendor(editId, data) 
                showToast("Vendor updated successfully..")
            
            } else {
                await createVendor(data)
                showToast("Vendor created successfully..")
            }

            setTimeout(() => {
                navigate("/dashboard/events");
            }, 1200)
        
        } catch (err: any) {
            showToast(err?.response?.data?.message || "Operation failed", "error");        
        
        } finally {
            setLoading(false)
        }
    }


    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F8F5F0] to-[#E8E3D8] text-[#0A0A0A] p-5 md:p-10">

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
            
                
        </div>
    )

}