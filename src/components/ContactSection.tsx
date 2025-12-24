import React, { useState } from "react";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Instagram, 
  Twitter,
  Send,
  Calendar,
  User,
  MessageSquare
} from "react-feather";


const ContactSection = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        eventType: "",
        message: ""
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Form submitted: ", formData)
    }


    return (
        <section id="contact" className="relative w-full min-h-screen py-28 px-5 bg-[#FDFCFB] font-[Poppins] overflow-hidden
                                            flex justify-center">

            {/* diamond shape */}
            <div className="absolute w-72 h-72 border border-[#E5DED1] top-18 left-18 rotate-45 z-0 opacity-70 
                            animate-rotateDiamond">

            </div>

            {/* right side panel */}
            <div className="absolute top-0 right-0 w-[45%] h-full bg-[#E5DED1] z-0"></div>

            <div className="relative z-10 max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2
                            gap-16 lg:gap-20 items-start">

                <div className="conatct-brand-column">

                    <div className="flex items-center justify-start gap-4 mb-8">
                        <div className="w-16 h-px bg-gradient-to-r from-[#9B2D2D] via-[#D4B483] to-[#9B2D2D]"></div>

                        <span className="text-sm uppercase tracking-[0.3em] font-semibold text-[#9B2D2D]">
                            Contact Us
                        </span>

                        <div className="w-16 h-px bg-gradient-to-r from-[#9B2D2D] via-[#D4B483] to-[#9B2D2D]"></div>

                    </div>

                    <h1 className="font-[Poppins] text-5xl md:text-7xl leading-[1.1] font-semibold">
                        <span className="text-[#D4B483]">Event</span> 
                        <span className="text-[#9B2D2D]">ora</span> 
                    </h1>

                    <p className="text-xl text-[#0F0F0F]/80 leading-relaxed max-w-xl">
                        Crafting bespoke experiences in New York and beyond. Reach out to discuss your next signature event.
                    </p>


                    <div className="conatct-method space-y-5 mb-12 pt-8">

                        {/* address */}
                        <div className="flex items-center group">
                            <div className="w-8 text-[#9B2D2D] transition-transform duration-300 group-hover:scale-110 group-hover:drop-shadow-sm">
                                <MapPin size={20} />
                            </div>
                            <p className="ml-3 text-[#1A1A1A] font-medium font-serif">
                                244 Madison Avenue, Suite 522,<br />
                                Midtown Manhattan, New York, NY 10016
                            </p>
                        </div>

                        {/* phone no */}
                        <div className="flex items-center group">
                            <div className="w-8 text-[#9B2D2D] transition-transform duration-300 group-hover:scale-110 group-hover:drop-shadow-sm">
                                <Phone size={20} />
                            </div>
                            <a href="tel:+919944475341" className="ml-3 text-[#1A1A1A] font-medium hover:text-[#8B0000] transition-colors font-serif">
                                +91 99444 75341
                            </a>
                        </div>

                        {/* email */}
                        <div className="flex items-center group">
                            <div className="w-8 text-[#9B2D2D] transition-transform duration-300 group-hover:scale-110 group-hover:drop-shadow-sm">
                                <Mail size={20} />
                            </div>
                            <a href="mailto:info@eventora.com" className="ml-3 text-[#1A1A1A] font-medium hover:text-[#8B0000] transition-colors font-serif">
                                info@eventora.com
                            </a>
                        </div>
                    </div>

                    {/* social media */}
                    <div className="contact-socials flex gap-5">
                        <a href="#" aria-label="Facebook" className="text-[#0F0F0F] transition-all duration-300 hover:text-[#9B2D2D] hover:-translate-y-1">
                            <Facebook size={24} />
                        </a>

                        <a href="#" aria-label="Instagram" className="text-[#0F0F0F] transition-all duration-300 hover:text-[#9B2D2D] hover:-translate-y-1">
                            <Instagram size={24} />
                        </a>

                        <a href="#" aria-label="Twitter" className="text-[#0F0F0F] transition-all duration-300 hover:text-[#9B2D2D] hover:-translate-y-1">
                            <Twitter size={24} />
                        </a>
                    </div>
                </div>


                {/* right column form card */}
                <div className="contact-form-card bg-white p-12 lg:p-14 shadow-[20px_20px_0px_#8B0000] transition-transform 
                                duration-400 hover:-translate-x-1 hover:-translate-y-1">

                    <h3 className="font-serif text-2xl mb-8 text-[#0F0F0F]/80">Inquiry Form</h3>
                
                    {/* submit */}
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* name */}
                        <div className="relative group">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9B2D2D]">
                                <User size={18} />
                            </div>

                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="w-full py-4 pl-12 border-0 border-b border-[#E5DED1] bg-transparent outline-none font-sans text-sm 
                                        focus:border-b-2 focus:border-[#8B0000] transition-all duration-300
                                        placeholder:text-[#D4B483]/80 placeholder:font-normal placeholder:tarcking-wide"
                            />     

                            <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-[#8B0000] transition-all duration-400 group-hover:left-0 
                                            group-hover:w-full">
                                        
                            </span>
                        </div>   

                        {/* email */}
                        <div className="relative group">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9B2D2D]">
                                <Mail size={18} />
                            </div>

                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                className="w-full py-4 pl-12 border-0 border-b border-[#E5DED1] bg-transparent outline-none font-sans text-sm 
                                        focus:border-b-2 focus:border-[#8B0000] transition-all duration-300
                                        placeholder:text-[#D4B483]/80 placeholder:font-normal placeholder:tarcking-wide"
                            />

                            <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-[#8B0000] transition-all duration-400 group-hover:left-0 
                                            group-hover:w-full">

                            </span>
                        </div>

                        {/* event type */}
                        <div className="relative group">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9B2D2D]">
                                <Calendar size={18} />
                            </div>

                            <input
                                type="text"
                                name="eventType"
                                placeholder="Event Type (Wedding, Gala, Corporate)"
                                value={formData.eventType}
                                onChange={handleInputChange}
                                className="w-full py-4 pl-12 border-0 border-b border-[#E5DED1] bg-transparent outline-none font-sans text-sm 
                                        focus:border-b-2 focus:border-[#8B0000] transition-all duration-300
                                        placeholder:text-[#D4B483]/80 placeholder:font-normal placeholder:tarcking-wide"
                            />

                            <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-[#8B0000] transition-all duration-400 group-hover:left-0 
                                            group-hover:w-full">
                                            
                            </span>
                        </div>

                        {/* message */}
                        <div className="relative group">
                            <div className="absolute left-3 top-6 text-[#9B2D2D]">
                                <MessageSquare size={18} />
                            </div>

                            <textarea
                                name="message"
                                placeholder="Tell us more about your vision..."
                                value={formData.message}
                                onChange={handleInputChange}
                                rows={4}
                                className="w-full py-4 pl-12 border-0 border-b border-[#E5DED1] bg-transparent outline-none font-sans text-sm 
                                        resize-none focus:border-b-2 focus:border-[#8B0000] transition-all duration-300 min-h-[100px]
                                        placeholder:text-[#D4B483]/80 placeholder:font-normal placeholder:tarcking-wide"

                            />

                            <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-[#8B0000] transition-all duration-400 group-hover:left-0 
                                            group-hover:w-full">

                            </span>
                        </div>


                        {/* button */}
                        <button
                            type="submit"
                            className="w-full py-5 bg-[#0F0F0F]/80 text-white border-none font-sans font-bold uppercase tracking-wider cursor-pointer 
                                    relative overflow-hidden group ">
              
                            <span className="flex justify-center items-center gap-3">
                                              Begin Your Journey
                                <Send className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                            </span>
                            
                        </button>

                    </form>
                </div>
            </div>
        </section>
    )
}


export default ContactSection