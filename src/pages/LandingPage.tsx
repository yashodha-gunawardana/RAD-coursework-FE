// App.tsx
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import ServiceSection from '../components/ServiceSection';

const LandingPage: React.FC = () => {

    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="bg-[#0A0A0A] text-[#F5F5F5] min-h-screen overflow-x-hidden">
            <Header isScrolled={isScrolled} />
            <HeroSection />
            <AboutSection />
            <ServiceSection />
            
        </div>
    );
}

export default LandingPage
