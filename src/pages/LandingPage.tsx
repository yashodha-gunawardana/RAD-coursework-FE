// App.tsx
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';

const LandingPage: React.FC = () => {

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="bg-[#0A0A0A] text-[#F5F5F5] min-h-screen overflow-x-hidden">
            {/* COMMIT: pass scroll state to header */}
            <Header isScrolled={isScrolled} />

            {/* COMMIT: add hero section to landing page */}
            <HeroSection />

            {/* COMMIT: add about section to landing page */}
            <AboutSection />
        </div>
    );
}

export default LandingPage
