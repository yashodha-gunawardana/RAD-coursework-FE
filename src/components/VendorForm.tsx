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
            
            <div className="max-w-6xl mx-auto">

                {/* header */}
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                    <div>
                        <h1 className="text-2xl md:text-6xl font-bold text-[#8B0000]/80 font-[poppins]">
                        
                            {editId ? "Edit Vendor Details" : "Add New Vendor"}

                        </h1>
                    </div>

                    <button
                        onClick={() => navigate("/dashboard/vendors")}
                        className="text-[#0A0A0A]/80 font-semibold text-l flex items-center gap-2 hover:text-[#8B0000] transition-colors">
                        
                            <ChevronLeft size={16} />

                                Back to Vendors
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-10">

                    {/* sidebar */}
                    <aside className="lg:col-span-1">
                        <div className="sticky top-8">
                            <h2 className="text-lg font-bold text-[#0A0A0A]/80 mb-2">
                                
                                General Information
                            </h2>
                            
                            <p className="text-sm text-[#0A0A0A]/80">
                                Add or update vendor details for your elite event management system.
                            </p>
                        </div>
                    </aside>

                    {/* main form */}
                    <main className="lg:col-span-3">
                        <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-xl p-6 md:p-8">

                            <form onSubmit={handleSubmit}>
                                <span className="flex items-start gap-3 block text-xl uppercase tracking-wider font-bold text-[#C5A059] mb-6 pb-2 border-b-2 border-[#FDFCF0]">
                  
                                    <Clipboard className="w-8 h-8 text-[#C5A059]" />
                            
                                        Vendor Essentials
                                </span>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                    {/* vendor name */}
                                    <div className="md:col-span-2">
                                        <label className="block text-[15px] font-semibold text-[#0A0A0A] mb-2">
                      
                                            Vendor Name <span className="text-[#8B0000]">*</span>

                                        </label>

                                        <input
                                            type="text"
                                            id="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-[#E5E7EB] rounded-xl bg-[#FAFAFA] text-[#121212] text-sm
                                                        focus:outline-none focus:border-[#C5A059] focus:bg-white focus:ring-4 focus:ring-[#C5A059]/10
                                                        transition-all"
                                            placeholder="e.g. Elite Photography Studio"
                                            required
                                            disabled={loading}
                                        />
                                    </div>

                                    {/* category */}
                                    <div>
                                        <label className="block text-[15px] font-semibold text-[#0A0A0A] mb-2">
                                            
                                            Category <span className="text-[#8B0000]">*</span>

                                        </label>

                                        <select
                                            id="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-[#E5E7EB] rounded-xl bg-[#FAFAFA] text-[#121212] text-sm
                                                        focus:outline-none focus:border-[#C5A059] focus:bg-white focus:ring-4 focus:ring-[#C5A059]/10
                                                        transition-all"
                                            required
                                            disabled={loading}>

                                                <option value="">Select Category</option>
                                                <option value={VendorCategory.PHOTOGRAPY}>Photography</option>
                                                <option value={VendorCategory.CATERING}>Catering</option>
                                                <option value={VendorCategory.DECORATION}>Decoration</option>
                                                <option value={VendorCategory.DJ}>DJ</option>
                                                <option value={VendorCategory.VENUE}>Venue</option>
                                                <option value={VendorCategory.MAKEUP}>Makeup Artist</option>
                                                <option value={VendorCategory.FLORIST}>Florist</option>
                                                <option value={VendorCategory.OTHER}>Other</option>
                                        </select>
                                    </div>

                                    {/* contact */}
                                    <div>
                                        <label className="block text-[15px] font-semibold text-[#0A0A0A] mb-2">
                                        
                                            Contact Info <span className="text-[#8B0000]">*</span>

                                        </label>

                                        <input
                                            type="text"
                                            id="contact"
                                            value={formData.contact}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-[#E5E7EB] rounded-xl bg-[#FAFAFA] text-[#121212] text-sm
                                                        focus:outline-none focus:border-[#C5A059] focus:bg-white focus:ring-4 focus:ring-[#C5A059]/10
                                                        transition-all"
                                            placeholder="Phone or Email"
                                            required
                                            disabled={loading}
                                        />
                                    </div>

                                    {/* price range */}
                                    <div className="md:col-span-2">
                                        <label className="block text-[15px] font-semibold text-[#0A0A0A] mb-2">
                                        
                                            Price Range <span className="text-[#8B0000]">*</span>

                                        </label>

                                        <input
                                            type="text"
                                            id="priceRange"
                                            value={formData.priceRange}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-[#E5E7EB] rounded-xl bg-[#FAFAFA] text-[#121212] text-sm
                                                        focus:outline-none focus:border-[#C5A059] focus:bg-white focus:ring-4 focus:ring-[#C5A059]/10
                                                        transition-all"
                                            placeholder="e.g. $500 - $2000"
                                            required
                                            disabled={loading}
                                        />
                                    </div>

                                    {/* description */}
                                    <div className="md:col-span-2">
                                        <label className="block text-[15px] font-semibold text-[#0A0A0A] mb-2">
                                        
                                            Description

                                        </label>

                                        <textarea
                                            id="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-[#E5E7EB] rounded-xl bg-[#FAFAFA] text-[#121212] text-sm
                                                        focus:outline-none focus:border-[#C5A059] focus:bg-white focus:ring-4 focus:ring-[#C5A059]/10
                                                        transition-all resize-none"
                                            placeholder="Brief description of services..."
                                            rows={4}
                                            disabled={loading}
                                        />
                                    </div>

                                    {/* vendor photo */}
                                    <div className="md:col-span-2">
                                        <label className="block text-[15px] font-semibold text-[#0A0A0A] mb-2">
                                            
                                            Vendor Photo

                                        </label>

                                        <div
                                            onClick={() => document.getElementById("imageInput")?.click()}
                                            className="border-2 border-dashed border-[#E5E7EB] rounded-xl p-10 text-center cursor-pointer bg-[#FAFAFA] 
                                                        hover:border-[#8B0000] hover:bg-white transition-all">

                                                <ImageIcon size={32} className="text-[#C5A059] mx-auto mb-3" />
                                        
                                            <p className="font-semibold text-[#121212]">
                                                Click to upload or drag and drop
                                            </p>

                                            <p className="text-xs text-[#6B7280] mt-1">PNG, JPG (max. 5MB)</p>
                                        </div>

                                        <input
                                            type="file"
                                            id="imageInput"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImage}
                                            disabled={loading}
                                        />
                    
                                        {preview && (
                                            <div className="mt-5 rounded-xl overflow-hidden border border-[#E5E7EB] relative">
                                                <img src={preview} alt="Preview" className="w-full h-64 object-cover" />
                                                    
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setFormData((prev) => ({ ...prev, image: null }));
                                                        setPreview(null);
                                                    }}
                                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 
                                                               transition-all">
                                                        
                                                        <Trash2 size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* buttons */}
                                <div className="flex flex-col sm:flex-row justify-end gap-3 mt-10">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFormData({
                                                name: "",
                                                category: "",
                                                contact: "",
                                                priceRange: "",
                                                description: "",
                                                image: null,
                                                isAvailable: true
                                            })
                                            setPreview(null)
                                        }}
                                        className="px-6 py-3 bg-white border border-[#E5E7EB] text-[#6B7280] rounded-xl font-bold hover:bg-[#F3F4F6] hover:text-[#121212]
                                                    transition-all flex items-center justify-center">
                                    
                                            Cancel
                                    </button>
                  
                                    <button
                                        type="submit"
                                        // disabled={loading}
                                        className="relative bg-gradient-to-br from-[#9B2D2D] to-[#7A1C1C] text-white px-10 py-4 rounded-xl
                                                    font-semibold tracking-wide overflow-hidden group transition-all duration-400 hover:-translate-y-1
                                                    hover:shadow-xl hover:shadow-[#9B2D2D]/20 disabled:opacity-70 disabled:cursor-not-allowed">
                                    
                                        <span className="flex items-center gap-3">
                                        
                                            <Check className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                                        
                                                {/* {loading ? "Saving..." : editId ? "Update Vendor" : "Save Vendor"} */}
                                                Save Vendor
                                        </span>
                                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent
                                                    group-hover:translate-x-full transition-transform duration-600" />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )

}