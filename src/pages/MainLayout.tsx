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
    })
}