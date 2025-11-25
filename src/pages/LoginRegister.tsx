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

                {/* text overlay on image */}
                <div className="relative z-20 p-5 text-left text-white bg-black/20 rounded-lg backdrop-blur-sm"></div>
                    <h2 className="text-3xl font-extrabold uppercase leading-none">Visionary</h2>
                    <h2 className="text-3xl font-extrabold uppercase leading-none">Digital</h2>
                    <h2 className="text-3xl font-extrabold uppercase leading-none">Spaces</h2>
                    <h3 className="text-xl font-normal text-yellow-50 mt-2">{timeImages.heading}</h3>
                    <p className="text-gray-300 text-sm mt-5 border-l-2 border-yellow-50 pl-2">
                        Curating experiences that defy expectations and redefine posibility.
                    </p>
            </div>  
        </div>

        {/* right panel */}
        <div className="flex-1 bg-gray-900 text-white p-12 flex flex-col rounded-lg">

            {/* header: sign up / sign in buttons */}
            <div className="flex justify-between mb-8">
                <button className={`font-semibold ${formType === "signup" ? "opacity-100 border-b-white" : "opacity-50"}`}
                        onClick={() => switchForm("signup")}
                >Sign Up
                </button>
                <button className={`font-semibold ${formType === "signin" ? "opacity-100 border-b-white" : "opacity-50"}`}
                        onClick={() => switchForm("signin")}
                >Sign In
                </button>
            </div>

            {/* content section */}
            <div className="felx flex-1 gap-10">

                {/* left text section */}
                <div className="flex-1 flex flex-col justify-between pt-7 pb-7">
                    <p className="uppercase text-gray-400 text-sm tracking-wide">welcome</p>
                    <h1 className="text-3xl font-extrabold leading-snug">
                        {formType === "signup"
                            ? "Fill the form to become part of team"
                            : "Log in to access your dashboard"}
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
                                    className="px-5 py-4 rounded-md bg-gray-800 text-white outline-none"
                                    value={fullname}
                                    onChange={(e) => setFullname(e.target.value)}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Email"
                                    className="px-5 py-4 rounded-md bg-gray-800 text-white outline-none"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="px-5 py-4 rounded-md bg-gray-800 text-white outline-none"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="px-5 py-4 rounded-md bg-gray-800 text-white outline-none"
                                    value={password}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />

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

                                <div className="flex items-center gap-5">
                                    <button type="submit" className="bg-yellow-50 text-gray-900 px-6 py-3 rounded font-bold">
                                            Go
                                    </button>
                                    <p className="text-gray-400 text-sm">
                                        Already have a password? Use the{" "}
                                        <button type="button" onClick={() => switchForm("signin")} className="text-yellow-50 font-bold">
                                            login form
                                        </button>
                                    </p>
                                </div>
                            </>
                        )}

                        {/* sign in form */}
                        {formType === "signin" && (
                            <>
                                <input
                                    type="text"
                                    placeholder="Email"
                                    className="px-5 py-4 rounded-md bg-gray-800 text-white outline-none"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="px-5 py-4 rounded-md bg-gray-800 text-white outline-none"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <div className="flex items-center gap-5 mt-5">
                                    <button type="submit" className="bg-yellow-50 text-gray-900 px-6 py-3 rounded font-bold">
                                        Sign In
                                    </button>
                                    <p className="text-gray-400 text-sm">
                                        Forgot password?{" "}
                                        <a href="#" className="text-yellow-50 font-bold">
                                            Recover it here
                                        </a>
                                    </p>
                                </div>
                            </>
                        )}

                    </form>

                </div>
            </div>    
        </div>
        
    </div>
)

    
}