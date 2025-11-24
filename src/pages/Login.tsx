import { useState, type FormEvent } from "react";
import { getMyDetails, loginUser } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

export default function Login() {
    const navigate = useNavigate()

    // function to store logged-in user globally
    const { setUser } = useAuth()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")


    const handleLogin = async (e: FormEvent) => {
        e.preventDefault()
    }
}