import React, { act, useState } from "react";
import { Users, Calendar, Clipboard, Home, Bookmark, DollarSign, User, Settings, Menu } from "react-feather";


interface SidebarProps {
    isCollapsed: boolean
    isMobileOpen: boolean
    onToggleCollapse: () => void
    onToggleMobile: () => void

}


const Sidebar: React.FC<SidebarProps> = ({
    isCollapsed,
    isMobileOpen,
    onToggleCollapse,
    onToggleMobile
}) => {

    const mainMenuItems = [
        { id: "dashboard", icon: Clipboard, label: "Dashboard", active: true },
        { id: "users", icon: Users, label: "Users", active: false },
        { id: "events", icon: Calendar, label: "Events", active: false },
        { id: "vendors", icon: Home, label: "vendors", active: false}
    ];

    const managementItems = [
        { id: "booking", icon: Bookmark, label: "Booking" },
        { id: "budgets", icon: DollarSign, label: "Budgets" },
        { id: "guests", icon: Users, label: "Guests" }
    ];

    const settingItems = [
        { id: "settings", icon: Settings, label: "Settings" },
        { id: "admin", icon: User, label: "Admin" }
    ];


    // handle mobile overlay click to close menu
    const handleOverlayClick = () => {
        onToggleMobile();
    }

    // logout handle
    const handleLogout = () => {
        localStorage.removeItem("accessToken")
        window.location.href = "/auth"
    }


    return (
        <>
            <button
                onClick={onToggleMobile}
                className="lg:hidden fixed top-4 left-4 z-50 bg-white p-3 rounded-lg shadow-md flex items-center">

                    <Menu className="w-12 h-12 size-20" />
           </button>

           {isMobileOpen && (
                <div
                    onClick={handleOverlayClick}
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden">
                    
                </div>
           )}

           <aside
                className={`
                    ${isCollapsed ? "w-20" : "w-64"}
                    ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                    fixed lg:relative h-screen bg-gray-800 text-white transition-all duration-300 z-40
                    flex flex-col border-r border-red-800`}
                >
                
                <div className="p-6 border-b border-amber-200 flex items-center justify-between">

                </div>

           </aside>
        </>
    )

}
