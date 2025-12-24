import React, { useState } from "react";


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
        <section id="conatct" className="relative py-24 px-5 bg-[#FDFCFB] font-[Poppins] overflow-hidden
                                            flex justify-center">

            {/* diamond shape */}
            <div className="absolute w-72 h-72 border border-[#E5DED1] top-10 left-5 rotate-45 z-0 opacity-50 
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
                        Event<span className="text-[#9B2D2D]">ora</span> 
                    </h1>

                    <p className="text-xl text-[#0F0F0F]/80 leading-relaxed max-w-xl">
                        Crafting bespoke experiences in Coimbatore and beyond. Reach out to discuss your next signature event.
                    </p>


                    <div className="conatct-method space-y-5 mb-8">

                        {/* address */}
                        <div className="flex items-center group">
                            <i className="fas fa-map-marker-alt w-8 text-[#8B0000] text-lg transition-transform duration-300 
                                        group-hover:scale-110 group-hover:drop-shadow-sm"></i>
                            <p className="ml-3 text-[#1A1A1A] font-medium">#63 ARPEE Center, NSR Road, Coimbatore</p>
                        </div>

                        {/* phone no */}
                        <div className="flex items-center group">
                            <i className="fas fa-phone-alt w-8 text-[#8B0000] text-lg transition-transform duration-300 
                                        group-hover:scale-110 group-hover:drop-shadow-sm"></i>
                            <a href="tel:+919944475341" className="ml-3 text-[#1A1A1A] font-medium hover:text-[#8B0000] transition-colors">
                                +91 99444 75341
                            </a>
                        </div>

                        {/* email */}
                        <div className="flex items-center group">
                            <i className="fas fa-envelope w-8 text-[#8B0000] text-lg transition-transform duration-300 
                                        group-hover:scale-110 group-hover:drop-shadow-sm"></i>
                            <a href="mailto:info@eventora.com" className="ml-3 text-[#1A1A1A] font-medium hover:text-[#8B0000] transition-colors">
                                info@eventora.com
                            </a>
                        </div>
                    </div>

                    {/* social media */}
                    <div className="contact-socials flex gap-5">
                        <a href="#" aria-label="Facebook" className="text-[#1A1A1A] text-xl transition-all duration-300 hover:text-[#8B0000] hover:-translate-y-1">
                            <i className="fab fa-facebook-f"></i>
                        </a>

                        <a href="#" aria-label="Instagram" className="text-[#1A1A1A] text-xl transition-all duration-300 hover:text-[#8B0000] hover:-translate-y-1">
                            <i className="fab fa-instagram"></i>
                        </a>

                        <a href="#" aria-label="Twitter" className="text-[#1A1A1A] text-xl transition-all duration-300 hover:text-[#8B0000] hover:-translate-y-1">
                            <i className="fab fa-twitter"></i>
                        </a>
                    </div>
                </div>


                {/* right column form card */}
                <div className="contact-form-card bg-white p-12 lg:p-14 shadow-[20px_20px_0px_#8B0000] transition-transform 
                                duration-400 hover:-translate-x-1 hover:-translate-y-1">

                    <h3 className="font-serif text-2xl mb-8">Inquiry Form</h3>
                
                    {/* submit */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="relative group">
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="w-full py-4 border-0 border-b border-[#E5DED1] bg-transparent outline-none font-sans text-sm focus:border-b-2 focus:border-[#8B0000] transition-all duration-300"
                            />     

                        </div>                   
                    </form>
                </div>


            </div>

        </section>
    )
}


export default ContactSection