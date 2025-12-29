import React, { useEffect, useState, type ChangeEvent, type FormEvent} from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ChevronLeft,
  Image as ImageIcon,
  PlusCircle,
  Trash2,
  Check,
  CheckCircle,
  AlertCircle
} from "react-feather";
import { createEvent, getEventById, updateEvent } from "../services/events";


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
}

interface ToastState {
    show: boolean
    message: string
    type: "success" | "error"
}


const EventForm: React.FC = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

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
        image: null
    });

    const [extraItems, setExtraItems] = useState<ExtraItem[]>([]);
    const [preview, setPreview] = useState<string | null>(null);
    const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' });


    // handle input changes
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value } = e.target
        setEventData(prev => ({

            // update eventData dynamically and basePrice as number
            ...prev,
            [id]: id === "baseprice" ? parseFloat(value) || 0 : value
        }));
    }


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
        }
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
            getEventById(editId).then((eventData: any) => {

                setEventData({
                    _id: eventData._id,
                    title: eventData.title,
                    type: eventData.type,
                    date: eventData.date.split("T")[0], 
                    time: eventData.time || "",
                    location: eventData.location,
                    description: eventData.description || "",
                    basePrice: eventData.basePrice,
                    status: eventData.status,
                    extraItems: eventData.extraItems || []
                })

                // extra items with unique ids
                setExtraItems(eventData.extraItems?.map((item: any) => ({
                    ...item,
                    id: Date.now() + Math.random()
                })) || []);

                setPreview(eventData.image || null)
            
            }).catch(() => {
                showToast("Error loading event", "error")
            });
        }
    }, [editId]) // run effect when editid changes


    // submit form
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        if (!eventData.title || !eventData.type || !eventData.date || !eventData.location || !eventData.basePrice) {
            showToast("Required fields are missing..", "error")
            return
        }

        const formData = new FormData()
        formData.append("title", eventData.title)
        formData.append("type", eventData.type)
        formData.append("date", eventData.date)
        if (eventData.time) formData.append("time", eventData.time)
        formData.append("location", eventData.location)
        if (eventData.description) formData.append("description", eventData.description)
        formData.append("basePrice", eventData.basePrice.toString());
        formData.append("status", eventData.status);
        if (eventData.image) formData.append("image", eventData.image);


        // append extra items to form data
        extraItems.forEach((item: ExtraItem, idx: number) => {
            formData.append(`extraItems[${idx}][name]`, item.name);
            formData.append(`extraItems[${idx}][unitPrice]`, item.unitPrice.toString());
            formData.append(`extraItems[${idx}][quantity]`, item.quantity.toString());
        });

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
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F8F5F0] to-[#E8E3D8] text-[#0A0A0A] p-5
                        md:p-10 font-serif">
            
            {/* toast notifications */}
            {toast.show && (
                <div className={`fixed top-6 right-6 px-6 py-4 bg-[#121212] text-[#FDFCF0] rounded-xl shadow-lg
                                flex items-center gap-3 z-50 animate-slide-left`}>
                    
                    {toast.type === "success" ? (
                        <CheckCircle className="text-green-400" size={20} />
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
                        <h1 className="text-2xl md:text-3xl font-extrabold text-[#8B0000] tracking-tight">

                            {editId ? "Edit Event Details" : "Create Event"}

                        </h1>
                    </div>

                    <button
                        onClick={() => navigate("/dashboard/events")}
                        className="text-[#6B7280] font-semibold text-sm flex items-center gap-2 hover:text-[#8B0000] transition-colors">

                            <ChevronLeft size={16} />

                            Back to Dashboard
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-10">

                    {/* sidebar */}
                    <aside className="lg:col-span-1">
                        <div className="sticky top-8">
                            <h2 className="text-lg font-semibold text-[#121212] mb-2">

                                General Information
                            </h2>

                            <p className="text-sm text-[#6B7280]">
                                Enter the details for your event using our elite management system.
                            </p>
                        </div>
                    </aside>

                    {/* main form */}
                    <main className="lg:col-span-3">
                        <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-xl p-6 md:p-8">

                            <form id="eventForm" onSubmit={handleSubmit}>
                                <span className="block text-xs uppercase tracking-wider font-bold text-[#C5A059] mb-6 pb-2
                                                border-b-2 border-[#FDFCF0]">
                                                    
                                    Event Essentials

                                </span>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                    {/* title */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-[#121212] mb-2">
                                            
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
                                        <label className="block text-sm font-semibold text-[#121212] mb-2">
                      
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
                                        <label className="block text-sm font-semibold text-[#121212] mb-2">
                                
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
                                        <label className="block text-sm font-semibold text-[#121212] mb-2">
                      
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
                                        <label className="block text-sm font-semibold text-[#121212] mb-2">
                                            
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
                                        <label className="block text-sm font-semibold text-[#121212] mb-2">
                                        
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
                                        <label className="block text-sm font-semibold text-[#121212] mb-2">
                                        
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
                                </div>

                                {/* pricing */}
                                <div className="mt-10 pt-8 border-t border-[#E5E7EB]">
                                    <span className="block text-xs uppercase tracking-wider font-bold text-[#C5A059] mb-6 pb-2 border-b-2 border-[#FDFCF0]">
                    
                                        Pricing & Media
                  
                                    </span>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                        {/* base price */}
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-[#121212] mb-2">
                        
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
                                            <label className="block text-sm font-semibold text-[#121212] mb-2">
                        
                                                Cover Photo
                      
                                            </label>

                                            <div
                                                onClick={() => document.getElementById('imageInput')?.click()}
                                                className="border-2 border-dashed border-[#E5E7EB] rounded-xl p-10 text-center cursor-pointer bg-[#FAFAFA] hover:border-[#8B0000] 
                                                            hover:bg-white transition-all">
                        
                                                    <ImageIcon size={32} className="text-[#C5A059] mx-auto mb-3" />
                                                
                                                <p className="font-semibold text-[#121212]">
                                                    Click to upload or drag and drop
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
                                                <div className="mt-5 rounded-xl overflow-hidden border border-[#E5E7EB]">
                                                    <img
                                                        src={preview}
                                                        alt="Preview"
                                                        className="w-full h-64 object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setEventData(prev => ({ ...prev, image: null }));
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
                                </div>
                            </form>

                        </div>

                    </main>

                </div>

            </div>

        </div>
    )
}