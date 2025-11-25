import { useEffect, useState, type FormEvent } from "react";
import { getMyDetails, loginUser, registerUser } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const images = [
    {
        id: "morning",
        src: "/images/loginImage.png",
        heading: "Good morning! Let's start the day.."
    },
    {
        id: "day",
        src: "/images/loginImage1.png",
        heading: "Hello! Achieve Your Midday Goals.." 
    },
    {
        id: "evening",
        src: "/images/loginImage3.png",
        heading: "Wind Down. Prepare for Tomorrow.."
    },
    {
        id: "night",
        src: "/images/loginImage4.png",
        heading: "Working late? Stay Focused.."
    },
];

export default function LoginRegister() {
    const navigate = useNavigate()

    // function to store logged-in user globally
    const { setUser } = useAuth()
    const [formType, setFormType] = useState<"signup" | "signin">("signup");
    const [timeImages, setTimeImages] = useState(images[0])
    
    const [isLogin, setIsLogin] = useState(true)

    const [fullname, setFullname] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [termsChecked, setTermsChecked] = useState(false);

    const switchForm = (type: "signup" | "signin") => {
    setFormType(type);
  };
    
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
                    password
                })

                alert("Registration successful! Please login..")
                setIsLogin(true)
            }

        } catch (err) {
            console.error(err)
            alert("Something went wrong..")
        }
    }

    useEffect(() => {
        const updateBackgroundByTime = () => {
            const hour = new Date().getHours() // get current hour
            if (hour >= 6 && hour < 12) setTimeImages(images[0]) // morning
            else if (hour >= 12 && hour < 18) setTimeImages(images[1]) // day
            else if (hour >= 18 && hour < 21) setTimeImages(images[2]) // evening
            else setTimeImages(images[3]) // night
        };

        updateBackgroundByTime()
        const interval = setInterval(updateBackgroundByTime, 60000); // update every minutes
        
        // cleanup interval on component unmount to prevent memory leaks and stop repeated background updates
        return () => clearInterval(interval)
    })

    

    
}