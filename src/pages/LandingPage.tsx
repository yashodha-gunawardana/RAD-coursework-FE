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


    const navItems = [
        'HOME',
        'ABOUT US',
        'SERVICE',
        'GALLERY',
        'CONTACT US'
    ];


    // background image change
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

    
    // search box
    useEffect(() => {
        const handleClickOutSide = (event: MouseEvent) => {
            if (searchRef.current && !(searchRef.current as any).contains(event.target)) {
                setIsSearchOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutSide)

        return () => document.removeEventListener('mousedown', handleClickOutSide)

    }, []);



    return (
        <div className="bg-[#0A0A0A] text-[#F5F5F5] min-h-screen overflow-x-hidden">

            {/* hero section */}
            <div className="relative h-screen bg-cover- bg-center flex items-center justify-center text-center transition-all duration-1000 ease-in-out"
                            style={{backgroundImage: `linear-gradient(rgba(10,10,10,0.7), rgba(10,10,10,0.7)), url(${images[currentIndex]})`,
                            }}>

                {/* header */}
                <header className="fixed top-0 left-0 w-full z-50 py-6">
                    <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12">
                        <div className="flex justify-between items-center">

                            {/* logo */}
                            <div className="flex items-center gap-4 flex-shrink-0 cursor-pointer">
                                <div className="relative w-14 h-14 flex items-center justify-center">

                                    {/* outer gradient circle */}
                                    <div className="absolute w-full h-full bg-gradient-to-br from-[#8B0000] via-[#A52A2A] to-[#8b0000] rounded-full shadow-x1 shadow-[#8B0000]/30"></div>

                                    {/* inner dark circle */}
                                    <div className="absolute w-[90%] h-[90%] bg-[#0A0A0A] rounded-full"></div>

                                    {/* border circle */}
                                    <div className="absolute w-[85%] h-[85%] border-2 border-[#E6B17E] rounded-full"></div>

                                    <div className="relative z-10 font-serif text-xl font-bold text-[#E6B17E]">
                                        E
                                    </div>

                                    {/* small decorative dot */}
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#E6B17E] rounded-full"></div>
                                </div>    


                                {/* logo text */}
                                <div className="flex flex-col items-start">
                                    <div className="font-serif text-2xl font-bold text-[#F5F5F5] leading-none tracking-wider">
                                        <span className="text-[#E6B17E]">EVENT</span>ORA
                                    </div>
                                    <div className="text-[10px] text-[#F5F5F5]/70 tracking-[2.5px] mt-1 font-medium uppercase">
                                        Event Management
                                    </div>
                                </div>
                            </div>
                                    

                            {/* navigation menu */}
                            <div className="absolute left-1/2 transform -translate-x-1/2">
                            
                                <nav className="hidden lg:flex items-center gap-3.5 p-5 rounded-[30px] bg-[#0A0A0A]/35
                                                backdrop-blur-2xl border border-[#F5F5F5]/10 shadow-2xl shadow-black/25">

                                    {navItems.map((item, index) => (
                                        <div key={index} className="relative group">
                                            
                                        </div>
                                    ))}
                                </nav>
                            </div>
                                
                        

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

