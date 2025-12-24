import React from 'react';
import { Instagram, Facebook, Twitter, Youtube, ArrowRight } from 'react-feather';


const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0A0A0A] text-[#F5F5F5] border-t border-[#F5F5F5]/10">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12">

          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-4 mb-6">

                <div className="relative w-12 h-12 flex items-center justify-center">
                    <div className="absolute w-full h-full bg-gradient-to-br from-[#8B0000] via-[#A52A2A] to-[#8B0000] 
                                    rounded-full shadow-lg shadow-[#8B0000]/30">
                    </div>
                    <div className="absolute w-[90%] h-[90%] bg-[#0A0A0A] rounded-full"></div>
                    <div className="absolute w-[85%] h-[85%] border-2 border-[#E6B17E] rounded-full"></div>
                    <div className="relative z-10 font-serif text-lg font-bold text-[#E6B17E]">E</div>
                </div>

                <div className="font-serif text-2xl font-bold">
                    <span className="text-[#E6B17E]">EVENT</span>ORA
                </div>
            </div>

            <p className="text-[#F5F5F5]/70 mb-8 max-w-md">
              Creating unforgettable experiences through exceptional event planning and management services.
            </p>

            <div className="flex gap-3">
              {[Instagram, Facebook, Twitter, Youtube].map((Icon, index) => (
                <a 
                  key={index}
                  href="#" 
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-[#E6B17E]/10 to-[#8B0000]/10 border border-[#F5F5F5]/10 flex items-center justify-center text-[#F5F5F5] hover:text-[#E6B17E] hover:border-[#E6B17E]/30 hover:bg-gradient-to-br hover:from-[#E6B17E]/20 hover:to-[#8B0000]/20 transition-all duration-300 hover:scale-105"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-[#F5F5F5]">Quick Links</h3>
            <ul className="space-y-3.5">
              {['About Us', 'Services', 'Portfolio', 'Testimonials', 'Careers'].map((item, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className="text-[#F5F5F5]/70 hover:text-[#E6B17E] transition-colors duration-300 flex items-center gap-2 group hover:translate-x-1"
                  >
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="text-sm">{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-[#F5F5F5]">Our Services</h3>
            <ul className="space-y-3.5">
              {['Wedding Planning', 'Corporate Events', 'Private Parties', 'Venue Selection', 'Event Design', 'Catering'].map((item, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className="text-[#F5F5F5]/70 hover:text-[#E6B17E] transition-colors duration-300 text-sm hover:pl-1"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#F5F5F5]/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">

            <p className="text-[#F5F5F5]/50 text-sm text-center md:text-left">
                © {new Date().getFullYear()} Eventora. All rights reserved.
            </p>

            <div className="flex gap-6 text-sm text-[#F5F5F5]/60">
                <a href="#" className="hover:text-[#E6B17E] transition-colors duration-300">Privacy Policy</a>
                <a href="#" className="hover:text-[#E6B17E] transition-colors duration-300">Terms of Service</a>
                <a href="#" className="hover:text-[#E6B17E] transition-colors duration-300">Cookie Policy</a>
            </div>
    
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;