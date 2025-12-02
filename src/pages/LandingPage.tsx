import { useEffect, useRef, useState } from "react";
import { Search, UserPlus, ChevronRight, ChevronLeft, X } from "react-feather";


export default function LandingPage() {
    const images = [
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2940&auto=format&fit=crop', 
        'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2940&auto=format&fit=crop', 
        'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2938&auto=format&fit=crop', 
        'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2938&auto=format&fit=crop', 
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2940&auto=format&fit=crop', 
    ];

    const [currentIndex, setCurrentIndex] = useState(0)
    const [isSearchOpen, setIsSearchOpen] = useState(false)

    // ref for search container to detect clicks outside
    const searchRef = useRef(null)

    const changeSlide = (direction: number) => {

        // new slide index based on current index and direction (1 = next, -1 = previous)
        let newIndex = currentIndex + direction;

         // wrap to the last slide
        if (newIndex < 0) newIndex = images.length - 1;

        // wrap to the first slide
        if (newIndex >= images.length) newIndex = 0;
        
        setCurrentIndex(newIndex);
    };

    // directly jump to a specific slide by index
    const goToSlide = (index: number) => {
        setCurrentIndex(index)
    }

    useEffect(() => {
        const interval = setInterval(() => changeSlide(1), 7000);
        return() => clearInterval(interval);

    }, [currentIndex]);

    
    useEffect(() => {
        const handleClickOutSide = (event: MouseEvent) => {
            
        }
    })

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

                            {/* logo */}
                            <div className="flex items-center gap-4 shrink-0 cursor-pointer">
                                <div className="relative w-12 h-12 flex items-center justify-center">
                                    <div className="absolute w-full h-full border-2 boreder-[#E6B17E] rounded-xl rotate-45 transitional-all duration-500"></div>
                                    <div className="absolute w-full h-full top-1 left-1 right-1 bottom-1 border-[1.5px] border-[#8B0000] rounded-lg"></div>
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-45 text-xl font-serif font-bold 
                                                    text-[#F5F5F5] z-10 transition-all duration-500">
                                        E
                                    </div>
                                </div>    

                                {/* logo text */}
                                <div className="hidden sm:flex flex-col items-start">
                                    <div className="text-[#F5F5F5] font-serif text-xl font-semibold leading-none tracking-wide">
                                        <span className="text-[#E6B17E] font-bold uppercase">Event</span>ORA
                                    </div>
                                    <div className="text-[9px] text-[#F5F5F5]/70 tracking-[1.5px] mt-0.5 font-lih uppercase">Event Management</div>
                                </div>
                            </div>
                                    

                                

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

