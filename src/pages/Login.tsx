import { useState, type FormEvent } from "react";
import { getMyDetails, loginUser } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

export default function Login() {
    const navigate = useNavigate()
}