import React, { useEffect, useState, type ChangeEvent, type FormEvent} from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ChevronLeft,
  Image as ImageIcon,
  PlusCircle,
  Trash2,
  Check,
  CheckCircle,
  AlertCircle,
  Clipboard
} from "react-feather";
import { createEvent, getEventById, updateEvent } from "../services/events";
import { useAuth } from "../context/authContext";


interface ExtraItem {
    id: number
    name: string
    unitPrice: number
    quantity: number
}

interface EventData {
    _id?: string | null
    title: string;
    type: string;
    date: string;
    time?: string;
    location: string;
    description?: string;
    basePrice: number;
    status: string;
    extraItems?: ExtraItem[];
    image?: File | null;
    isPackage: boolean
}

interface ToastState {
    show: boolean
    message: string
    type: "success" | "error"
}


const EventForm: React.FC = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    const { user } = useAuth()
    const isAdmin = user?.roles?.includes("ADMIN")

    // get edit id from url params
    const editId = searchParams.get("edit") 

    const [eventData, setEventData] = useState<EventData>({
        title: "",
        type: "",
        date:  new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split("T")[0], 
        time: "",
        location: "",
        description: "",
        basePrice: 0,
        status: "PLANNING",
        extraItems: [],
        image: null,
        isPackage: false
    })

    const [extraItems, setExtraItems] = useState<ExtraItem[]>([])
    const [preview, setPreview] = useState<string | null>(null)
    const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' })
    const [loading, setLoading] = useState(false)
    const [imageRemoved, setImageRemoved] = useState(false)


    // handle input changes
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value } = e.target
        setEventData(prev => ({

            // update eventData dynamically and basePrice as number
            ...prev,
            [id]: id === "basePrice" ? Number(value) || 0 : value
        }));
    }

    const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { id, checked } = e.target;
        setEventData(prev => ({
            ...prev,
            [id]: checked,
        }));
    };


    // extra items management
    const addExtraItem = () => setExtraItems(prev => [...prev, {
        id: Date.now(), // unique id using timestamp
        name: " ",
        unitPrice: 0,
        quantity: 1
    }]);


    const updateExtraItem = (id: number, field: keyof ExtraItem, value: string | number) =>
        setExtraItems(prev => prev.map((item: ExtraItem) =>
            (item.id === id ? {
                ...item,

                // convert to number for price/quantity
                [field]: field === "name" ? value: Number(value)
            } : item)
        ));

        // remove an extra item by id
        const removeExtraItem = (id: number) => setExtraItems(prev => prev.filter((item: ExtraItem) => item.id !== id));


    // image upload handler
    const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setEventData(prev => ({ ...prev, image: e.target.files![0] }))
            
            // create preview URL
            setPreview(URL.createObjectURL(e.target.files[0]))
            setImageRemoved(false)
        }
    }

    const handleRemoveImage = () => {
        setEventData((prev) => ({ 
            ...prev, image: null 
        }))

        setPreview(null);
        setImageRemoved(true);
    }


    // toast notifications
    const showToast = (message: string, type: "success" | "error" = "success") => {
        setToast({ show: true, message, type })

        // hide automatically after the 3 seconds
        setTimeout(() => {
            setToast(prev => ({ ...prev, show: false }));
        }, 3000);
    }


    // fetch event data if in edit mode
    useEffect(() => {
        if (editId) {
            setLoading(true)
            getEventById(editId).then((eventData: any) => {

                setEventData({
                    _id: eventData._id,
                    title: eventData.title || "",
                    type: eventData.type || "",
                    date: eventData.date.split("T")[0], 
                    time: eventData.time || "",
                    location: eventData.location || "",
                    description: eventData.description || "",
                    basePrice: eventData.basePrice || 0,
                    status: eventData.status || "PLANNING",
                    image: null,
                    isPackage: eventData.isPackage || false
                })

                setExtraItems(
                    (eventData.extraItems || []).map((item: any, index: number) => ({
                        id: Date.now() + index + Math.random(),
                        name: item.name || "",
                        unitPrice: item.unitPrice || 0,
                        quantity: item.quantity || 1
                    }))
                );

                if (eventData.image) {
                    setPreview(eventData.image); // direct URL from backend
                }
            
            }).catch(() => {
                showToast("Error loading event", "error")
            })
            .finally (() => {
                setLoading(false)
            })
        
        } else {
            setEventData({
                title: "",
                type: "",
                date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split("T")[0],
                time: "",
                location: "",
                description: "",
                basePrice: 0,
                status: "PLANNING",
                image: null,
                isPackage: false
            })
             setExtraItems([]);
            setPreview(null);
            setImageRemoved(false)
            setLoading(false)
        }
    }, [editId]) // run effect when editid changes

    
    // submit form
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        if (!eventData.title || !eventData.type || !eventData.date || !eventData.location || eventData.basePrice <= 0) {
            showToast("Required fields are missing..", "error")
            return
        }

        setLoading(true)
        
        const formData = new FormData()
        formData.append("title", eventData.title)
        formData.append("type", eventData.type)
        formData.append("date", eventData.date)
        if (eventData.time) formData.append("time", eventData.time)
        formData.append("location", eventData.location)
        if (eventData.description) formData.append("description", eventData.description)
        formData.append("basePrice", eventData.basePrice.toString())
        formData.append("status", eventData.status)
        if (isAdmin && eventData.isPackage) {
        formData.append("isPackage", "true")
        }
      
        if (editId) {
            formData.append("imageRemoved", imageRemoved.toString())
        }

        // append new image if selected
        if (eventData.image instanceof File) {
            formData.append("image", eventData.image)
        }

        extraItems.forEach((item: ExtraItem, idx: number) => {
            if (item.name && item.name.trim() !== "") {
                formData.append(`extraItems[${idx}][name]`, item.name.trim())
                formData.append(`extraItems[${idx}][unitPrice]`, item.unitPrice.toString())
                formData.append(`extraItems[${idx}][quantity]`, item.quantity.toString())
            }
        })

        try {
            if (editId) {
                await updateEvent(editId, formData)
                showToast("Event updated successfully..")
            
            } else {
                await createEvent(formData)
                showToast("Event created successfully..")
            }

            setTimeout(() => {
                navigate("/dashboard/events");
            }, 1200)
        
        } catch (err: any) {
            showToast(err.response?.data?.message || "Error occurred", "error")
        
        } finally {
            setLoading(false)
        }
    }


    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F8F5F0] to-[#E8E3D8] text-[#0A0A0A] p-5 md:p-10">
            
            {/* toast notifications */}
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

                            {editId ? "Edit Event Details" : "Create Event"}

                        </h1>
                    </div>

                    <button
                        onClick={() => navigate("/dashboard/events")}
                        className="text-[#0A0A0A]/80 font-semibold text-l flex items-center gap-2 hover:text-[#8B0000] transition-colors">

                            <ChevronLeft size={16} />

                            Back to Dashboard
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
                                Enter the details for your event using our elite management system.
                            </p>
                        </div>
                    </aside>

                    {/* main form */}
                    <main className="lg:col-span-3">
                        <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-xl p-6 md:p-8">

                            <form id="eventForm" onSubmit={handleSubmit}>
                                <span className="flex items-start gap-3 block text-xl uppercase tracking-wider font-bold text-[#C5A059] mb-6 pb-2
                                                border-b-2 border-[#FDFCF0]">

                                    <Clipboard className="w-8 h-8 text-[#C5A059]" />            
                                    
                                        Event Essentials
                                </span>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                    {/* title */}
                                    <div className="md:col-span-2">
                                        <label className="block text-[15px] font-semibold text-[#0A0A0A] mb-2">
                                            
                                            Event Title <span className="text-[#8B0000]">*</span>

                                        </label>

                                        <input 
                                            type="text"
                                            id="title"
                                            value={eventData.title}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-[#E5E7EB] rounded-xl bg-[#FAFAFA] text-[#121212] text-sm
                                                        focus:outline-none focus:border-[#C5A059] focus:bg-white focus:ring-4 focus:ring-[#C5A059]/10
                                                        transition-all"
                                            placeholder="e.g. Corporate Gala 2024"
                                            required
                                        />
                                    </div>

                                    {/* category */}
                                    <div>
                                        <label className="block text-[15px] font-semibold text-[#0A0A0A] mb-2">
                      
                                            Category <span className="text-[#8B0000]">*</span>
                    
                                        </label>

                                        <select
                                            id="type"
                                            value={eventData.type}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-[#E5E7EB] rounded-xl bg-[#FAFAFA] text-[#121212] text-sm 
                                                        focus:outline-none focus:border-[#C5A059] focus:bg-white focus:ring-4 focus:ring-[#C5A059]/10 
                                                        transition-all"
                                            required>

                                                <option value="">Select Type</option>
                                                <option value="WEDDING">Wedding</option>
                                                <option value="BIRTHDAY">Birthday</option>
                                                <option value="CONFERENCE">Conference</option>
                                                <option value="CORPORATE">Corporate</option>
                                                <option value="PARTY">Party</option>
                                                <option value="OTHER">Other</option>
                                        </select>
                                    </div>

                                    {/* status */}
                                    <div>
                                        <label className="block text-[15px] font-semibold text-[#0A0A0A] mb-2">
                                
                                            Status
                    
                                        </label>

                                        <select
                                            id="status"
                                            value={eventData.status}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-[#E5E7EB] rounded-xl bg-[#FAFAFA] text-[#121212] text-sm 
                                                        focus:outline-none focus:border-[#C5A059] focus:bg-white focus:ring-4 focus:ring-[#C5A059]/10 
                                                        transition-all">

                                                <option value="PLANNING">Planning</option>
                                                <option value="ONGOING">Ongoing</option>
                                                <option value="COMPLETED">Completed</option>
                                                <option value="CANCELLED">Cancelled</option>
                                        </select>
                                    </div>

                                    {/* date */}
                                    <div>
                                        <label className="block text-[15px] font-semibold text-[#0A0A0A] mb-2">
                      
                                            Date <span className="text-[#8B0000]">*</span>

                                        </label>

                                        <input
                                            type="date"
                                            id="date"
                                            value={eventData.date}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-[#E5E7EB] rounded-xl bg-[#FAFAFA] text-[#121212] text-sm 
                                                        focus:outline-none focus:border-[#C5A059] focus:bg-white focus:ring-4 focus:ring-[#C5A059]/10 
                                                        transition-all"
                                            required
                                        />
                                    </div>

                                    {/* time */}
                                    <div>
                                        <label className="block text-[15px] font-semibold text-[#0A0A0A] mb-2">
                                            
                                            Starting Time

                                        </label>

                                        <input
                                            type="time"
                                            id="time"
                                            value={eventData.time}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-[#E5E7EB] rounded-xl bg-[#FAFAFA] text-[#121212] text-sm 
                                                        focus:outline-none focus:border-[#C5A059] focus:bg-white focus:ring-4 focus:ring-[#C5A059]/10 
                                                        transition-all"
                                        />
                                    </div>

                                    {/* location */}
                                    <div className="md:col-span-2">
                                        <label className="block text-[15px] font-semibold text-[#0A0A0A] mb-2">
                                        
                                            Venue / Location <span className="text-[#8B0000]">*</span>

                                        </label>

                                        <input
                                            type="text"
                                            id="location"
                                            value={eventData.location}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-[#E5E7EB] rounded-xl bg-[#FAFAFA] text-[#121212] text-sm 
                                                        focus:outline-none focus:border-[#C5A059] focus:bg-white focus:ring-4 focus:ring-[#C5A059]/10 
                                                        transition-all"
                                            placeholder="Enter venue name or address"
                                            required
                                        />
                                    </div>

                                    {/* description */}
                                    <div className="md:col-span-2">
                                        <label className="block text-[15px] font-semibold text-[#0A0A0A] mb-2">
                                        
                                            Description

                                        </label>

                                        <textarea
                                            id="description"
                                            value={eventData.description}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-[#E5E7EB] rounded-xl bg-[#FAFAFA] text-[#121212] text-sm 
                                                        focus:outline-none focus:border-[#C5A059] focus:bg-white focus:ring-4 focus:ring-[#C5A059]/10 
                                                        transition-all resize-none"
                                            placeholder="Brief overview..."
                                            rows={4}
                                        />
                                    </div>

                                    {/* isPackage */}
                                    {isAdmin && (  
                                        <div className="md:col-span-2 flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id="isPackage"
                                                checked={eventData.isPackage}
                                                onChange={handleCheckboxChange}
                                                className="w-4 h-4 text-[#C5A059] bg-gray-100 border-gray-300 rounded focus:ring-[#C5A059] focus:ring-2"
                                            />
                                            <label htmlFor="isPackage" className="text-[15px] font-semibold text-[#0A0A0A]">
                                                Mark as Package (Admin Only)
                                            </label>
                                        </div>
                                    )}
                                </div>

                                {/* pricing */}
                                <div className="mt-10 pt-8 border-t border-[#E5E7EB]">
                                    <span className="block text-xl uppercase tracking-wider font-bold text-[#C5A059] mb-6 pb-2 border-b-2 border-[#FDFCF0]">
                    
                                        Pricing & Media
                  
                                    </span>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                        {/* base price */}
                                        <div className="md:col-span-2">
                                            <label className="block text-[15px] font-semibold text-[#0A0A0A] mb-2">
                        
                                                Base Budget / Price ($) <span className="text-[#8B0000]">*</span>
                      
                                            </label>

                                            <input
                                                type="number"
                                                id="basePrice"
                                                value={eventData.basePrice || ''}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border border-[#E5E7EB] rounded-xl bg-[#FAFAFA] text-[#121212] text-sm 
                                                            focus:outline-none focus:border-[#C5A059] focus:bg-white focus:ring-4 focus:ring-[#C5A059]/10 
                                                            transition-all"
                                                placeholder="0.00"
                                                min="0"
                                                step="0.01"
                                                required
                                            />
                                        </div>

                                        {/* cover photo */}
                                        <div className="md:col-span-2">
                                            <label className="block text-[15px] font-semibold text-[#0A0A0A] mb-2">
                        
                                                Cover Photo
                      
                                            </label>

                                            <div
                                                onClick={() => document.getElementById('imageInput')?.click()}
                                                className="border-2 border-dashed border-[#E5E7EB] rounded-xl p-10 text-center cursor-pointer bg-[#FAFAFA] hover:border-[#8B0000] 
                                                            hover:bg-white transition-all">
                        
                                                    <ImageIcon size={32} className="text-[#C5A059] mx-auto mb-3" />
                                                
                                                <p className="font-semibold text-[#121212]">
                                                    {preview ? "Change cover photo" : "Click to upload or drag and drop"}
                                                </p>

                                                <p className="text-xs text-[#6B7280] mt-1">
                                                    PNG, JPG (max. 5MB)
                                                </p>
                                            </div>

                                            <input
                                                type="file"
                                                id="imageInput"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleImage}
                                            />

                                            {preview && (
                                                <div className="mt-5 rounded-xl overflow-hidden border border-[#E5E7EB] relative">
                                                    <img
                                                        src={preview}
                                                        alt="Event Cover Preview"
                                                        className="w-full h-64 object-cover"
                                                        onError={() => {
                                                            console.error("Image failed to load:", preview);
                                                            setPreview(null);
                                                            showToast("Failed to load existing image", "error");
                                                        }}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={handleRemoveImage} 
                                                        className="absolute top-4  right-4 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 
                                                                    transition-all">
                                                        
                                                        <Trash2 size={18} />

                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* extra items */}
                                <div className="mt-10 pt-8 border-t border-[#E5E7EB]">
                                     <span className="block text-xl uppercase tracking-wider font-bold text-[#C5A059] mb-6 pb-2 border-b-2 border-[#FDFCF0]">
                    
                                        Line Items / Extras

                                    </span>

                                    <div id="extraItemsContainer" className="space-y-3">

                                        {extraItems.map((item: ExtraItem) => (
                                            <div key={item.id} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">

                                                <input
                                                    type="text"
                                                    value={item.name}
                                                    onChange={(e) => updateExtraItem(item.id, 'name', e.target.value)}
                                                    className="px-4 py-3 border border-[#E5E7EB] rounded-xl bg-[#FAFAFA] text-[#121212] text-sm 
                                                                focus:outline-none focus:border-[#C5A059] focus:ring-4 focus:ring-[#C5A059]/10 transition-all"
                                                    placeholder="Item Name"
                                                />

                                                <input
                                                    type="number"
                                                    value={item.unitPrice || ''}
                                                    onChange={(e) => updateExtraItem(item.id, 'unitPrice', e.target.value)}
                                                    className="px-4 py-3 border border-[#E5E7EB] rounded-xl bg-[#FAFAFA] text-[#121212] text-sm 
                                                                focus:outline-none focus:border-[#C5A059] focus:ring-4 focus:ring-[#C5A059]/10 transition-all"
                                                    placeholder="Price"
                                                    min="0"
                                                    step="0.01"
                                                />

                                                <input
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => updateExtraItem(item.id, 'quantity', e.target.value)}
                                                    className="px-4 py-3 border border-[#E5E7EB] rounded-xl bg-[#FAFAFA] text-[#121212] text-sm 
                                                                focus:outline-none focus:border-[#C5A059] focus:ring-4 focus:ring-[#C5A059]/10 transition-all"
                                                    placeholder="Qty"
                                                    min="1"
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() => removeExtraItem(item.id)}
                                                    className="flex items-center justify-center h-12 text-red-800 bg-red-200 border border-red-300 rounded-lg hover:text-black 
                                                                transition-all">
                                                
                                                        <Trash2 size={20} />

                                                </button>
                                            </div>   
                                        ))}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={addExtraItem}
                                        className="w-full mt-4 px-4 py-3 border border-dashed border-[#C5A059] text-[#C5A059] rounded-xl font-bold hover:border-[#8B0000] 
                                                    hover:text-[#8B0000] hover:bg-[#FDFCF0] transition-all flex items-center justify-center gap-2">
                                    
                                            <PlusCircle size={18} />

                                                Add Custom Charge
                                    </button>
                                </div>

                                {/* action buttons */}
                                <div className="flex flex-col sm:flex-row justify-end gap-3 mt-10">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEventData({
                                                title: "",
                                                type: "",
                                                date: new Date(new Date().setDate(new Date().getDate() + 1))
                                                    .toISOString()
                                                    .split("T")[0],
                                                time: "",
                                                location: "",
                                                description: "",
                                                basePrice: 0,
                                                status: "PLANNING",
                                                extraItems: [],
                                                image: null,
                                                isPackage: false
                                            });
                                                setExtraItems([]);
                                                setPreview(null);
                                        }}
                                        className="px-6 py-3 bg-white border border-[#E5E7EB] text-[#6B7280] rounded-xl font-bold hover:bg-[#F3F4F6] hover:text-[#121212] 
                                                    transition-all flex items-center justify-center">
                                            
                                            Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="relative bg-gradient-to-br from-[#9B2D2D] to-[#7A1C1C] text-white px-10 py-4 rounded-xl 
                                                    font-semibold tracking-wide overflow-hidden group transition-all duration-400 hover:-translate-y-1 
                                                    hover:shadow-xl hover:shadow-[#9B2D2D]/20">
                                        
                                            <span className="flex items-center gap-3">
                                                              
                                                <Check className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                                              
                                                    {loading ? "Saving..." : editId ? "Update Event" : "Create Event"}  

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


export default EventForm
