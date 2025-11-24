import { useEffect, useState, type FormEvent } from "react";
import { getMyDetails, loginUser, registerUser } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

export default function LoginRegister() {
    const navigate = useNavigate()

    // function to store logged-in user globally
    const { setUser } = useAuth()
    const [formType, setFormType] = useState<"signup" | "signin">("signup");
    const [isLogin, setIsLogin] = useState(true)

    const [fullname, setFullname] = useState("")
    const [address, setAdress] = useState("")
    const [phone, setPhone] = useState("")

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [confirmPassword, setConfirmPassword] = useState("")
    const [termsChecked, setTermsChecked] = useState(false);

    
    const handleSubmit = async (e: FormEvent) => {
        // prevent default form refresh
        e.preventDefault()

        if (!email || !password) {
            alert("All fields are required..")
            return
        }

        
        try {

            if (formType === "signin") {
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

                // fetch currently logged-in user details
                const details = await getMyDetails()

                // store user data in AuthContext
                setUser(details.data)

                navigate("/home")
            
            }

            if (formType === "signup") {

                if (password !== confirmPassword) {
                    alert("Passwords do not match..")
                    return
                }

                if (!termsChecked) {
                    alert("You must accept the terms..")
                    return
                }

                await registerUser({
                    fullname,
                    email,
                    password,
                    address,
                    phone
                })

                alert("Registration successful! Please login..")
                setIsLogin(true)
            }

        } catch (err) {
            console.error(err)
            alert("Something went wrong..")
        }
    }

    return (
        

    )

    
}