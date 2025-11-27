import { useEffect, useState } from "react"


export default function LandingPage() {
    const images = [
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2940&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1515934751635-c81c6ebb6c1a?q=80&w=2940&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1464366400609708-7b9f2e6c07.jpg?q=80&w=2940&auto=format&fit=crop",
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
        <div className="relative h-screen text-white bg-cover- bg-center transition-all duration-1000"
                        style={{backgroundImage: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url(${images[currentIndex]})`,
                        }}>

            {/* header */}
            <header className="absolute top-0 left-0 w-full flex justify-between items-center px-8 py-5 z-50">
                <div className="text-2xl font-bold uppercase tracking-widest">
                    <span className="text-orange-400"> Eventora</span> Event Management
                </div>
                    
            </header>

        </div>
    )
}

