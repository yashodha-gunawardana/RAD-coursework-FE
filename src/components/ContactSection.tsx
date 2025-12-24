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

            </div>

        </section>
    )
}


export default ContactSection