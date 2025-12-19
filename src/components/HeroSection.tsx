import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft } from 'react-feather';

const images = [
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2940&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2940&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2938&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2938&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1558618666-?q=80&w=2940&auto=format&fit=crop',
];

const HeroSection: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

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
        return () => clearInterval(interval);
    }, [currentIndex]);


    return (
        <div id="hero" className="relative h-screen bg-cover bg-center flex items-center justify-center text-center transition-all duration-1000 ease-in-out"
            style={{
                backgroundImage: `linear-gradient(rgba(10,10,10,0.7), rgba(10,10,10,0.7)), url(${images[currentIndex]})`,
            }}>

            {/* hero content */}
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

                        every  event  should  be  perfect
                    </p>

                    {/* buttons */}
                    <div className="flex justify-center gap-5 flex-wrap">
                        <a href="#about" className="px-10 py-3.5 rounded-full font-bold tracking-wider cursor-pointer transition-all
                                              duration-400 border-none text-base inline-flex items-center justify-center
                                              bg-gradient-to-br from-[#8B0000] to-[#A52A2A] text-[#F5F5F5] shadow-lg
                                              shadow-[#8B0000]/30 hover:-translate-y-1 hover:bg-gradient-to-br 
                                              hover:from-[#7A0000] hover:to-[#8B1A1A] hover:shadow-xl hover:shadow-[#8B0000]/40">

                            ABOUT US
                        </a>

                        <a href="#contact" className="px-10 py-3.5 rounded-full font-bold tracking-wider cursor-pointer transition-all
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
    );
};

export default HeroSection;