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