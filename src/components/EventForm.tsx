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
        })
        ))
}