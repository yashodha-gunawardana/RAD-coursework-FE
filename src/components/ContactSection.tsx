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

        </section>
    )
}