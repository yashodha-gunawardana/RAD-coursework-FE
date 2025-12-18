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

  return (
    <header className={`fixed top-0 left-0 w-full z-50 py-6 transition-all duration-300 
                        ${isScrolled ? 'bg-[#0A0A0A]/90 backdrop-blur-lg' : 'bg-transparent'}`}>

      <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center">

          {/* Logo */}
          <div className="flex items-center gap-4 flex-shrink-0 cursor-pointer">
            <div className="relative w-14 h-14 flex items-center justify-center">

              {/* outer gradient circle */}
              <div className="absolute w-full h-full bg-gradient-to-br from-[#8B0000] via-[#A52A2A] to-[#8b0000] 
                                  rounded-full shadow-x1 shadow-[#8B0000]/30"></div>

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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden w-12 h-12 rounded-full bg-gradient-to-br from-[#E6B17E]/15 to-[#8B0000]/15 
                            border border-[#F5F5F5]/20 flex items-center justify-center text-[#F5F5F5] cursor-pointer transition-all 
                            duration-300 hover:from-[#E6B17E]/25 hover:to-[#8B0000]/25 hover:text-[#E6B17E] hover:border-[#E6B17E]/50 
                            hover:scale-105 hover:shadow-lg hover:shadow-[#E6B17E]/20"
          >
            {isMobileMenuOpen ? <XIcon className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Navigation Menu */}
          <div className={`absolute lg:static left-1/2 lg:left-auto transform lg:transform-none -translate-x-1/2 lg:translate-x-0 
                            ${isMobileMenuOpen ? 'top-full mt-4' : 'hidden'} lg:block`}>

            <nav className={`hidden lg:flex items-center gap-3.5 p-5 rounded-[30px] 
                                  ${isScrolled ? 'bg-[#0A0A0A]/35 backdrop-blur-2xl border border-[#F5F5F5]/10 shadow-2xl shadow-black/25'
                : 'bg-[#0A0A0A]/35 backdrop-blur-2xl border border-[#F5F5F5]/10 shadow-2xl shadow-black/25'} 
                                  ${isMobileMenuOpen ? 'flex flex-col bg-[#0A0A0A] p-4 rounded-2xl border border-[#F5F5F5]/10 shadow-2xl shadow-black/25 min-w-[200px]'
                : ''}`
            }>

              {navItems.map((item, index) => (

                <div key={index} className="relative group">

                  <button
                    onClick={() => scrollToSection(item.sectionId)}
                    className="relative text-[#F5F5F5]/90 hover:text-[#E6B17E] transition-all duration-300 font-semibold text-sm 
                                    tracking-wider uppercase px-4 py-2 block bg-transparent border-none cursor-pointer"
                  >
                    <span className="relative z-10 inline-block transition-all duration-300 group-hover:scale-105 group-hover:font-bold">
                      {item.name}
                    </span>

                    <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[#E6B17E] via-[#8B0000] to-[#E6B17E] transition-all 
                                        duration-500 group-hover:w-full">

                    </div>

                  </button>
                </div>
              ))}
            </nav>
          </div>

          {/* search and signup */}
          <div className="flex items-center gap-5 flex-shrink-0">
            <div className="relative" ref={searchRef}>
              <div className="flex items-center">
                <div className={`flex items-center transition-all duration-400 
                                  ${isSearchOpen ? 'w-72' : 'w-12'} overflow-hidden`}>

                  <button
                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                    className={`flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-[#E6B17E]/15 to-[#8B0000]/15 
                                    border border-[#F5F5F5]/20 flex items-center justify-center text-[#F5F5F5] cursor-pointer transition-all 
                                    duration-300 hover:from-[#E6B17E]/25 hover:to-[#8B0000]/25 hover:text-[#E6B17E] hover:border-[#E6B17E]/50 
                                    hover:scale-105 hover:shadow-lg hover:shadow-[#E6B17E]/20`}
                  >
                    {isSearchOpen ? <XIcon className="w-5 h-5 transition-all duration-300" /> : <Search className="w-5 h-5 transition-all duration-300" />}
                  </button>

                  {/* search input field */}
                  <div className={`flex-1 ml-3 transition-all duration-400 ${isSearchOpen ? 'opacity-100 visible' : 'opacity-0 invisible w-0'}`}>
                    <div className="relative">

                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#F5F5F5]/50" />

                      <input
                        type="text"
                        className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#F5F5F5]/20 bg-[#0A0A0A]/70 backdrop-blur-xl 
                                        text-[#F5F5F5] text-sm outline-none transition-all duration-300 focus:border-[#E6B17E] placeholder:text-[#F5F5F5]/50"
                        placeholder="Search events.."
                        autoFocus={isSearchOpen}
                      />

                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* sign up button */}
            <button className="hidden sm:flex px-8 py-3 bg-gradient-to-br from-[#8B0000] via-[#A52A2A] to-[#8B0000] text-[#F5F5F5] 
                                    border border-[#8B0000]/30 rounded-2xl font-bold text-sm cursor-pointer transition-all duration-300 shadow-2xl 
                                    shadow-[#8B0000]/20 hover:-translate-y-0.5 hover:shadow-3xl hover:shadow-[#8B0000]/30 hover:from-[#7A0000] hover:to-[#9B0000] 
                                    items-center gap-2.5 group">

              <UserPlus className="w-4 h-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />

              <span className="tracking-wider text-sm">
                SIGN UP
              </span>

            </button>
          </div>
        </div>
      </div>
    </header>
  );

}   


export default Header