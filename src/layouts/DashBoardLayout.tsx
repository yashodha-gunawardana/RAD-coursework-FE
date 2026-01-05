import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";


const DashBoardLayout: React.FC = () => {
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


    return (
        <div className="flex h-screen overflow-hidden">
        
            <Sidebar

                isCollapsed={isSidebarCollapsed}
                isMobileOpen={isMobileMenuOpen}
                onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                onToggleMobile={() => setIsMobileMenuOpen(!isMobileMenuOpen)}

            />

            <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 relative overflow-hidden">
                <Outlet />
            </main>

        </div>
    )
}

export default DashBoardLayout