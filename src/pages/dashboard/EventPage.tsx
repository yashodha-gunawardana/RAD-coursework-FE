import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Filter,
  Edit,
  Eye,
  Trash2,
  TrendingUp,
  TrendingDown,
  AlertCircle
} from "react-feather";
import { getMyEvents, deleteEvent } from "../../services/events";


const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
    
}

