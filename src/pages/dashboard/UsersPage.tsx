import React, { useEffect, useState, useCallback} from "react";
import {
  User,
  CheckCircle,
  XCircle,
  Filter,
  Search,
  Trash2,
  AlertCircle,
  TrendingUp,
  Users,
  Shield,
  Clock,
} from "react-feather";
import { getAllUsers, approveVendorRequest, rejectVendorRequest } from "../../services/auth";