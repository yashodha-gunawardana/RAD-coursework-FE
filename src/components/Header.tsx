import React, { useState, useRef, useEffect } from 'react';
import { Search, UserPlus, Menu, X as XIcon } from 'react-feather';


interface HeaderProps {
    isScrolled?: boolean;
}

const Header: React.FC<HeaderProps> = ({ isScrolled = false }) => {

    const [isSearchOpen, setIsSearchOpen] = useState(false); 
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 
    const searchRef = useRef<HTMLDivElement>(null);

    const navItems = [

      { name: 'HOME', sectionId: 'hero' },
      { name: 'ABOUT US', sectionId: 'about' },
      { name: 'SERVICE', sectionId: 'services' },
      { name: 'GALLERY', sectionId: 'gallery' },
      { name: 'CONTACT US', sectionId: 'contact' },

    ];


    const scrollToSection = (sectionId: string) => {

      const element = document.getElementById(sectionId);

        if (element) {
          const headerHeight = 96;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }

        setIsMobileMenuOpen(false);
    };


    useEffect(() => {

      const handleClickOutside = (event: MouseEvent) => {
        if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
          setIsSearchOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
      
    }, []);

}  