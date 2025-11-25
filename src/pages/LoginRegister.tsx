import { useEffect, useState, type FormEvent } from "react";
import { getMyDetails, loginUser, registerUser } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import morningImg from "../assets/images/loginImage.png";
import dayImg from "../assets/images/loginimage2.png";
import eveningImg from "../assets/images/loginImage3.png";
import nightImg from "../assets/images/loginImage4.png";


const images = [
    {
        id: "morning",
        src: morningImg,
        heading: "Good morning! Let's start the day.."
    },
    {
        id: "day",
        src: dayImg,
        heading: "Hello! Achieve Your Midday Goals.." 
    },
    {
        id: "evening",
        src: eveningImg,
        heading: "Wind Down. Prepare for Tomorrow.."
    },
    {
        id: "night",
        src: nightImg,
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

    }, []); // runce once on mount

    return (
    <div className="relative flex justify-center items-center min-h-screen bg-gray-100 overflow-hidden">

        {/* background waves */}
        <div className="absolute -top-[10vh] -left-[10vw] w-[120vw] h-[120vh] 
                    bg-gradient-to-br from-teal-800 to-sky-500 rotate-[-15deg] 
                    origin-top-left rounded-[0_0_80%_0/0_0_10%_0] 
                    shadow-[0_15px_45px_rgba(0,0,0,0.3)] z-0">
        </div>
        <div className="absolute -top-[12vh] -left-[8vw] w-[120vw] h-[120vh]
                        bg-sky-300 rotate-[17deg] origin-top-left
                        rounded-[0_0_70%_0/0_0_20%-0] opacity-80 z-1">
        </div>

        {/* card container */}
        <div className="relative flex w-[1050px] h-[680px]
                        shadow-[0_15px_45px_rgba(0,0,0,0,3)]
                        rounded-x1 overflow-hidden bg-yellow-50 p-10 z-10">

            {/* left panel */}
            <div className="flex-none w-[400px] relative mr-4 rounded-lg
                            overflow-hidden bg-blue-900 flex justify-center items-center">

                {/* background image (change with time) */}
                <img 
                    src={timeImages.src}
                    alt={timeImages.id}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                />

                {/* vertical divider */}
                <div className="absolute top-0 right-8 w-[3px] h-full bg-yellow-50 opacity-80"></div>
            </div>  
        </div>

    </div>
)

    
}