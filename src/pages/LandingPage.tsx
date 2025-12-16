import { useEffect, useRef, useState } from "react";
import { Search, UserPlus, ChevronRight, ChevronLeft, X, MessageCircle, ArrowRight, Award, Heart, Star, Globe, Check, Users, Clock, Shield } from "react-feather";


export default function LandingPage() {
    const images = [
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2940&auto=format&fit=crop', 
        'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2940&auto=format&fit=crop', 
        'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2938&auto=format&fit=crop', 
        'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2938&auto=format&fit=crop', 
        'https://images.unsplash.com/photo-1558618666-?q=80&w=2940&auto=format&fit=crop', 
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
                                            <a href="#" className="relative text-[#F5F5F5]/90 hover:text-[#E6B17E] transition-all duration-300 font-semibold 
                                                                    text-sm tracking-wider uppercase px-4 py-2 group">

                                                <span className="relative z-10 inline-block transition-all duration-300 group-hover:scale-105 group-hover:font-bold">
                                                    {item}
                                                </span>

                                                <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[#e6B17E] via-[#8B0000] to-[#E6B17E]
                                                                    transition-all duration-500 group-hover:w-full">

                                                </div>
                                            </a>
                                        </div>
                                    ))}
                                </nav>
                            </div>
                                
                        
                            {/* search and signup */}
                            <div className="flex items-center gap-5 flex-shrink-0">
                                <div className="relative" ref={searchRef}>
                                    <div className="flex items-center">
                                        <div className={`flex items-center transition-all duration-400 ${isSearchOpen ? 'w-72' : 'w-12'} overflow-hidden`}>

                                            <button onClick={() => setIsSearchOpen(!isSearchOpen)}
                                                    className={`flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-[#E6B17E]/15 to-[#8B0000]/15 border 
                                                                    border-[#F5F5F5]/20 flex items-center justify-center text-[#F5F5F5] cursor-pointer transition-all
                                                                    duration-300 hover:from-[#E6B17E]/25 hover:to-[#8B0000]/25 hover:text-[#E6B17E] hover:border-[#E6B17E]/50
                                                                    hover:scale-105 hover:shadow-lg hover:shadow-[#E6B17E]/20`}>

                                                {isSearchOpen ? (
                                                    <X className="w-5 h-5 transition-all duration-300" />
                                                ) : (
                                                    <Search className="w-5 h-5 transition-all duration-300" />
                                                )}                       
                                            </button>

                                            {/* search input field */}
                                            <div className={`flex-1 ml-3 transition-all duration-400 ${isSearchOpen ? 'opacity-100 visible' : 'opacity-0 invisible w-0'}`}>
                                                <div className="relative">

                                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#F5F5F5]/50" />
                                                    <input type="text" className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#F5F5F5]/20 bg-[#0A0A0A]/70
                                                                                    backdrop-blur-xl text-[#F5F5F5] text-sm outline-none transition-all duration-300 focus:border-[#E6B17E]
                                                                                    placeholder:text-[#F5F5F5]/50" placeholder="Search events.." autoFocus={isSearchOpen}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* sign up button */}
                                <button className="px-8 py-3 bg-gradient-to-br from-[#8B0000] via-[#A52A2A] to-[#8B0000] text-[#F5F5F5]
                                                    border border-[#8B0000]/30 rounded-2xl font-bold text-sm cursor-pointer transition-all duration-300 shadow-2xl
                                                    shadow-[#8B0000]/20 hover:-translate-y-0.5 hover:shadow-3xl hover:shadow-[#8B0000]/30 hover:from-[#7A0000]
                                                    hover:to-[#9B0000] flex items-center gap-2.5 group">

                                    <UserPlus className="w-4 h-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                                        <span className="hidden sm:inline tracking-wider text:sm">
                                            SIGN UP
                                        </span>
                                
                                </button>    
                            </div>
                        </div>
                    </div>   
                </header>

                {/* hero contect */}
                <div className="max-w-[1000px] w-full z-10 px-8 relative">
                    
                    {/* left arrow */}
                    <button onClick={() => changeSlide(-1)}
                            className="absolute left-0 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-gradient-to-br from-[#E6B17E]/15
                                        to-[#8B0000]/15 backdrop-blur-lg rounded-full flex items-center justify-center cursor-pointer z-10 
                                        transition-all duration-300 border border-[#F5F5F5]/20 hover:from-[#E6B17E]/25 hover:to-[#8B0000]/25 
                                        hover:scale-110 hover:shadow-xl hover:shadow-[#E6B17E]/20 group">

                        <ChevronLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />

                    </button>

                    {/* right arrow */}
                    <button onClick={() => changeSlide(1)}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-gradient-to-br from-[#E6B17E]/15 
                                    to-[#8B0000]/15 backdrop-blur-lg rounded-full flex items-center justify-center cursor-pointer z-10 
                                    transition-all duration-300 border border-[#F5F5F5]/20 hover:from-[#E6B17E]/25 hover:to-[#8B0000]/25 
                                    hover:scale-110 hover:shadow-xl hover:shadow-[#E6B17E]/20 group">

                        <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />

                    </button>

                    {/* main content */}
                    <div className="mx-auto max-w-[800px]">
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 tracking-tight
                                        text-[#F5F5F5] font-serif leading-none">

                            <span className="block">One Stop</span>
                            <span className="block text-[#E6B17E] mt-2">Event Planner</span>
                        </h1>

                        <p className="text-lg sm:text-xl lg:text-2xl tracking-[0.3em] mb-10
                                        text-[#F5F5F5]/80 uppercase font-semibold">

                            every  event  sould  be  perfect
                        </p>

                        {/* buttons */}
                        <div className="flex justify-center gap-5 flex-wrap">
                            <a href="#" className="px-10 py-3.5 rounded-full font-bold tracking-wider cursor-pointer transition-all
                                                    duration-400 border-none text-base inline-flex items-center justify-center
                                                    bg-gradient-to-br from-[#8B0000] to-[#A52A2A] text-[#F5F5F5] shadow-lg
                                                    shadow-[#8B0000]/30 hover:-translate-y-1 hover:bg-gradient-to-br 
                                                    hover:from-[#7A0000] hover:to-[#8B1A1A] hover:shadow-xl hover:shadow-[#8B0000]/40">

                                ABOUT US
                            </a>

                            <a href="#" className="px-10 py-3.5 rounded-full font-bold tracking-wider cursor-pointer transition-all
                                                    duration-400 border-2 border-[#E6B17E] text-base inline-flex items-center
                                                    justify-center bg-transparent text-[#F5F5F5] shadow-lg shadow-[#E6B17E]/10
                                                    hover:-translate-y-1 hover:bg-[#E6B17E] hover:text-[#0A0A0A] hover:shadow-xl
                                                    hover:shadow-[#E6B17E]/20">

                                GET STARTED
                            </a>
                        </div>
                    </div>
                </div>

                {/* slide indicator dots */}
                <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex gap-3">
                                                
                    {images.map((_, index) => (
                        <button 
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all duration-500
                                        ${index === currentIndex
                                            // active dots
                                            ? 'bg-[#E6B17E] scale-125 shadow-lg shadow-[#E6B17E]/30'
                                            // inactive dots
                                            : 'bg-[#F5F5F5]/30 hover:bg-[#E6B17E] hover:scale-110'
                                        }`}>

                        </button>
                    ))}
                </div>

                <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[#0A0A0A]
                                    to-transparent pointer-events-none">

                </div>

            </div>


            {/* about section */}
            <section id="about" className="min-h-screen flex items-center py-24 px-6 md:px-12 lg:px-24 
                                            bg-gradient-to-b from-[#F8F5F0] to-[#E8E3D8]">
                
                <div className="max-w-7xl mx-auto w-full">
                    <div className="grid lg:grid-cols-2 gap-16 items-start">

                        {/* left colum */}
                        <div className="space-y-10">

                            {/* header section */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-[1px] bg-gradient-to-r from-[#8B0000] to-[#E6B17E]"></div>
                                    <span className="text-sm uppercase tracking-[0.3em] font-semibold text-[#8B0000]">
                                        The Art of Celebration
                                    </span>
                                    <div className="w-122 h-[1px] bg-gradient-to-l from-[#8B0000] to-[#E6B17E]"></div>
                                </div>

                                <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] text-[#0F0F0F]">

                                    Where <span className="text-[#8B0000]">Vision</span> Meets<br />
                                    <span className="text-[#E6B17E]">Prefection</span> in Every<br />
                                    <span className="text-[#0F0F0F]">Detail</span>
                                </h2>  

                                <p className="text-xl text-[#0F0F0F]/80 leading-relaxed max-w-xl">

                                    At <span className="font-semibold text-[#0F0F0F]">Eventora</span>, we transform your dreams into breathtaking
                                    realities. With 15 years of excellence, we craft events that resonate with elegance, emotion, and unforgettable moments.
                                </p>
                            </div>

                            <div className="bg-white p-8 rounded-3xl border border-[#E6B17E]/20 shadow-lg">
                                <div className="flex items-start gap-6">
                                    
                                    <div className="text-5xl text-[#E6B17E] opacity-50">
                                        <MessageCircle />

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
        </div>

        
    );
}

