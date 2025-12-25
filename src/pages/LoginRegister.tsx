import { useEffect, useState, type FormEvent } from "react";
import { getMyDetails, loginUser, registerUser } from "../services/auth";
import { Form, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import morningImg from "../assets/images/loginImage.png";
import dayImg from "../assets/images/loginimage2.png";
import eveningImg from "../assets/images/loginImage3.png";
import nightImg from "../assets/images/loginImage4.png";
import { ArrowRight, Facebook, Twitter, Youtube, Linkedin, Lock } from "react-feather";


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
    const location = useLocation()

    // function to store logged-in user globally
    const { setUser } = useAuth()
    const [formType, setFormType] = useState<"signup" | "signin">("signup");
    const [timeImages, setTimeImages] = useState(images[0])
    
    // const [isLogin, setIsLogin] = useState(true)

    const [fullname, setFullname] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [role, setRole] = useState("USER")
    const [termsChecked, setTermsChecked] = useState(false);

    const switchForm = (type: "signup" | "signin") => {
    setFormType(type);
  };
    
    const handleSubmit = async (e: FormEvent) => {
        // prevent default form refresh
        e.preventDefault()

        if (formType === "signup" && (!fullname || !email || !password || !confirmPassword)) {
            alert("All fields are required..")
            return
        }

        if (formType == "signin" && (!email || !password)) {
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
                    role
                })

                alert("Registration successful! Please login..")

                // reset fields
                setFullname("")
                setEmail("")
                setPassword("")
                setConfirmPassword("")
                setTermsChecked(false)

                // auto switch to login page
                setFormType("signin")
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
        <div className="absolute inset-0 bg-[#EEE9DF] z-0"></div>
        <div className="absolute top-1/3 -left-20 w-[120%] h-8
                        bg-gradient-to-r from-[#2C3B4D] to-[#1B2632]
                        rounded-full opacity-90 z-1 transform -rotate-3">
        </div>
        <div className="absolute top-1/2 -right-10 w-[110%] h-6
                        bg-gradient-to-r from-[#C9C1B1] to-[#A35139]
                        rounded-full opacity-80 z-2 transform rotate-2">
        </div>
        <div className="absolute top-2/3 -left-10 w-[115%] h-4
                        bg-gradient-to-r from-[#FFB162] to-[#A35139]
                        rounded-full opacity-85 z-3 transform -rotate-1">
        </div>
        

        {/* card container */}
        <div className="relative flex w-[1050px] h-[680px]
                        shadow-[0_15px_45px_rgba(0,0,0,0.3)]
                        rounded-xl overflow-hidden bg-yellow-50 border-2 border-black z-10">

            {/* left panel */}
            <div className="flex-none w-[320px] relative  
                            overflow-hidden bg-blue-900 flex justify-center items-center">

                {/* background image (change with time) */}
                <img 
                    src={timeImages.src}
                    alt={timeImages.id}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                />

                {/* vertical divider */}
                <div className="absolute top-0 right-8 w-[3px] h-full bg-yellow-50 opacity-80"></div>

                {/* text overlay on image */}
                <div className="relative z-20 p-5 text-left text-white bg-black/20 rounded-lg backdrop-blur-sm">
                    <h2 className="text-3xl font-extrabold uppercase leading-none">Unforgettable</h2>
                    <h2 className="text-3xl font-extrabold uppercase leading-none">Event</h2>
                    <h2 className="text-3xl font-extrabold uppercase leading-none">Experiences</h2>
                    <h3 className="text-xl font-normal text-yellow-50 mt-2">{timeImages.heading}</h3>
                    <p className="text-gray-300 text-sm mt-5 border-l-2 border-yellow-50 pl-2">
                        Curating experiences that defy expectations and redefine possibility.
                    </p>
                </div>
            </div>  

            {/* right panel */}
            <div className="flex-1 bg-gray-900 text-white p-12 flex flex-col rounded-lg">

                {/* header: sign up / sign in buttons */}
                <div className="flex justify-between mb-8">
                    <button className={`font-semibold ${formType === "signup" ? "opacity-100 border-b-2 border-white" : "opacity-50"}`}
                            onClick={() => switchForm("signup")}
                    >Sign Up
                    </button>
                    <button className={`font-semibold ${formType === "signin" ? "opacity-100 border-b-2 border-white" : "opacity-50"}`}
                            onClick={() => switchForm("signin")}
                    >Sign In
                    </button>
                </div>

                {/* content section */}
                <div className="flex flex-1 gap-10">

                    {/* left text section */}
                    <div className="flex-1 flex flex-col pt-7 pb-7">
                        <p className="uppercase text-gray-400 text-sm tracking-wide" style={{fontFamily: 'Inter, sans-serif'}}>welcome</p>
                        <h1 className="text-5xl font-extrabold mt-4">
                            {formType === "signup"
                                ? "Fill the form to become part of team"
                                : "Sign in and continue your journey with us"}
                        </h1>
                    </div>

                    {/* right form section */}
                    <div className="flex-1 flex flex-col pt-0">
                        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>

                            {/* sign up form */}
                            {formType === "signup" && (
                                <>
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        className="w-[320px] px-5 py-4 rounded-md bg-gray-800 text-white outline-none"
                                        value={fullname}
                                        onChange={(e) => setFullname(e.target.value)}
                                        required
                                    />
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        className="w-[320px] px-5 py-4 rounded-md bg-gray-800 text-white outline-none"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                    <div className="relative w-[320px]">
                                        {/* Lock Icon */}
                                        <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />

                                        <input
                                            type="password"
                                            placeholder="Password"
                                            className="w-[320px] px-5 py-4 rounded-md bg-gray-800 text-white outline-none"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    
                                    <div className="relative w-[320px]">
                                        {/* Lock Icon */}
                                        <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />

                                        <input
                                            type="password"
                                            placeholder="Confirm Password"
                                            className="w-[320px] px-5 py-4 rounded-md bg-gray-800 text-white outline-none"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                    </div>      

                                    {/* terms checkbox */}
                                    <div className="flex items-center gap-3 mt-2 mb-6">
                                        <input
                                            type="checkbox"
                                            id="terms"
                                            className="w-4 h-4 border border-gray-500 rounded"
                                            checked={termsChecked}
                                            onChange={(e) => setTermsChecked(e.target.checked)}
                                        />
                                        <label htmlFor="terms" className="text-gray-400 text-sm">
                                            I agree to the terms of service
                                        </label>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button type="submit" className="flex items-center justify-center gap-2 bg-yellow-50 text-gray-900 px-6 py-3 rounded font-bold">
                                                Go
                                                <ArrowRight color="black" size={20}/>  
                                        </button>
                                        <div className="flex-1 text-right">
                                            <p className="text-gray-400 text-sm">
                                                Already have an account? {" "}
                                                <button type="button" onClick={() => switchForm("signin")} className="text-yellow-50 font-bold">
                                                    login form
                                                </button>
                                            </p>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* sign in form */}
                            {formType === "signin" && (
                                <>
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        className="w-[320px] px-5 py-4 rounded-md bg-gray-800 text-white outline-none"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                    <div className="relative w-[320px]">
                                        {/* Lock Icon */}
                                        <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />

                                        <input
                                            type="password"
                                            placeholder="Password"
                                            className="w-[320px] px-5 py-4 rounded-md bg-gray-800 text-white outline-none"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="flex items-center gap-5 mt-5">
                                        <button type="submit" className="flex items-center justify-center gap-2 bg-yellow-50 text-gray-900 px-6 py-3 rounded font-bold">
                                            Sign In
                                            <ArrowRight color="black" size={20}/>
                                        </button>
                                        <div className="flex-1 text-right">
                                            <p className="text-gray-400 text-sm">
                                                Forgot your password?{" "}
                                                <a href="#" className="text-yellow-50 font-bold">
                                                    Recover it here
                                                </a>
                                            </p>
                                        </div>    
                                    </div>
                                </>
                            )}
                        </form>
                    </div>
                </div> 

                {/* horizontal divider */}
                <div className="absolute bottom-28 right-13 h-[1px] w-[320px] bg-yellow-50 opacity-80"></div>

                {/* footer with social links */}
                <div className="flex justify-between items-end mt-auto pt-4">
                    <p className="text-gray-400"> social networks</p>
                    <div className="flex gap-3 mr-32">
                        <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 text-white 
                                                transition-all duration-300
                                                hover:bg-yellow-50 hover:text-gray-900 hover:scale-110">
                            <Facebook size={18} />
                        </a>
                        <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 text-white
                                                transition-all duration-300
                                                hover:bg-yellow-50 hover:text-gray-900 hover:scale-110">
                            <Twitter size={18} />
                        </a>
                        <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 text-white
                                                transition-all duration-300
                                                hover:bg-yellow-50 hover:text-gray-900 hover:scale-110">
                            <Youtube size={18} />
                        </a>
                        <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 text-white
                                                transition-all duration-300
                                                hover:bg-yellow-50 hover:text-gray-900 hover:scale-110">
                            <Linkedin size={18} />
                        </a>
                    </div>
                </div>   
            </div>
        </div>
    </div>
);

    
}