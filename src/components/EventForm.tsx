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

            </div>

        </div>
    )
}