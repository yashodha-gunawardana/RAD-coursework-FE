import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";


const MainLayout: React.FC = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)


    useEffect(() => {
        const handleReSize = () => {
            if (window.innerWidth < 1024) {
                setIsSidebarCollapsed(false)
            }
        }

        handleReSize() // initial check on mount
        window.addEventListener("resize", handleReSize)

        return () => window.removeEventListener("resize", handleReSize)
    }, [])


    // Toggle sidebar collapse
    const handleToggleCollapse = () => {  
        setIsSidebarCollapsed(!isSidebarCollapsed);  
    };

    // Toggle mobile menu
    const handleToggleMobile = () => {    
        setIsMobileMenuOpen(!isMobileMenuOpen);      
    };


    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 font-poppins">
            <div className="flex">

                <Sidebar

                    isCollapsed={isSidebarCollapsed}
                    isMobileOpen={isMobileMenuOpen}
                    onToggleCollapse={handleToggleCollapse}
                    onToggleMobile={handleToggleMobile}

                />

            </div>

        </div>
    )
}