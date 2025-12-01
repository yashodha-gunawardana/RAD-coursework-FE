import { useEffect, useState } from "react";
import {Home, Info, Heart, Image, Mail } from "react-feather";


export default function LandingPage() {
    const images = [
        'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2940&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2940&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2938&auto=format&fit=crop'
    ];

    const [currentIndex, setCurrentIndex] = useState(0)
    const [scrolled, setScrolled] = useState(false)

    const changeSlide = (direction: number) => {

        // new slide index based on current index and direction (1 = next, -1 = previous)
        let newIndex = currentIndex + direction;

         // wrap to the last slide
        if (newIndex < 0) newIndex = images.length - 1;

        // wrap to the first slide
        if (newIndex >= images.length) newIndex = 0;
        
        setCurrentIndex(newIndex);
    };

    useEffect(() => {
        const interval = setInterval(() => changeSlide(1), 7000);
        return() => clearInterval(interval);

    }, [currentIndex]);

    useEffect(() => {
        
        // check scroll position
        const handleScroll = () => setScrolled(window.scrollY > 50);

        // listen to scroll event
        window.addEventListener("scroll", handleScroll);

        // remove listener on unmount
        return () => window.removeEventListener("scroll", handleScroll);

    }, []);

    return (
        <div className="bg-[#0A0A0A] text-[#F5F5F5] min-h-screen overflow-x-hidden">

            {/* hero section */}
            <div className="relative h-screen bg-cover- bg-center flex items-center justify-center text-center transition-all duration-1000 ease-in-out"
                            style={{backgroundImage: `linear-gradient(rgba(10,10,10,0.7), rgba(10,10,10,0.7)), url(${images[currentIndex]})`,
                            }}>

                {/* header */}
                <header className="fixed top-0 left-0 w-full z-50">
                    <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-10">
                        <div className="flex justify-between items-center py-8">

                            <nav className={`flex items-center gap-20 p-5 rounded-[60px] bg-white/10 backdrop-blur-[24px]
                                            border border-white/20 shadow-[0_15px_40px_rgba(0,0,0,0.18)] 
                                            transition-all duration-300`}>

                                {/* nav icon link */}
                                <a href="/" className="group relative text-white text-xl md:text-2xl hover:text-[#d4e157] transition transform hover:-translate-y hover:scale-110">
                                    <Home size={28}  />
                                    <span className="absolute top-full left-1/2 transform -translate-x-1 text-sm bg-black/70
                                                    px-3 py-1.5 rounded opacity-0 pointer-events-none transition-all group-hover:opacity-100 mt-1">
                                        Home
                                    </span>
                                </a>
                                <a href="/about" className="group relative text-white text-xl md:text-2xl hover:text-[#d4e157] transition transform hover:-translate-y hover:scale-110">
                                    <Info size={28}  />
                                    <span className="absolute top-full left-1/2 transform -translate-x-1 text-sm bg-black/70
                                                    px-3 py-1.5 rounded opacity-0 pointer-events-none transition-all group-hover:opacity-100 mt-1">
                                        About Us
                                    </span>
                                </a>
                                <a href="/services" className="group relative text-white text-xl md:text-2xl hover:text-[#d4e157] transition transform hover:-translate-y hover:scale-110">
                                    <Heart size={28}  />
                                    <span className="absolute top-full left-1/2 transform -translate-x-1 text-sm bg-black/70
                                                    px-3 py-1.5 rounded opacity-0 pointer-events-none transition-all group-hover:opacity-100 mt-1">
                                        Service
                                    </span>
                                </a>
                                <a href="/gallery" className="group relative text-white text-xl md:text-2xl hover:text-[#d4e157] transition transform hover:-translate-y hover:scale-110">
                                    <Image size={28}  />
                                    <span className="absolute top-full left-1/2 transform -translate-x-1 text-sm bg-black/70
                                                    px-3 py-1.5 rounded opacity-0 pointer-events-none transition-all group-hover:opacity-100 mt-1">
                                        Gallery
                                    </span>
                                </a>
                                <a href="/contact" className="group relative text-white text-xl md:text-2xl hover:text-[#d4e157] transition transform hover:-translate-y hover:scale-110">
                                    <Mail size={28}  />
                                    <span className="absolute top-full left-1/2 transform -translate-x-1 text-sm bg-black/70
                                                    px-3 py-1.5 rounded opacity-0 pointer-events-none transition-all group-hover:opacity-100 mt-1">
                                        Contact Us
                                    </span>
                                </a> 
                            </nav>

                            {/* signup button */}
                            <div className="flex items-center gap-4">
                                <a href="#" className="hidden md:inline-block px-10 py-3 bg-[#d4e157] text-black
                                                        font-semibold rounded-full shadow-lg hover:bg-[#e8f56a]
                                                        hover:-translate-y-1 transition-all">
                                        Sign Up Now
                                </a>
                            </div>
                            
                        </div>
                    </div>   
                </header>

            </div>

        </div>

    )
}

