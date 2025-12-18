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

}  