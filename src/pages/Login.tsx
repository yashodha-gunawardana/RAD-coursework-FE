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
        // prevent default form refresh
        e.preventDefault()

        if (!email || !password) {
            alert("All fields are required..")
            return
        }

        try {
            // send login request to backend
            const res = await loginUser(email, password)

            // verify token received
            console.log(res.data.accessToken)

            // check if token exists
            if (!res.data.accessToken) {
                alert("Login failed..")
                return
            }

            localStorage.setItem("accessToken", res.data.accessToken)

        } catch (err) {

        }
    }
}