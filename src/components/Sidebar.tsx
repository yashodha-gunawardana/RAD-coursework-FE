import React, { useState } from "react";
import { Users, Calendar, Clipboard, Home, Bookmark, DollarSign, User, Settings, Menu, ChevronLeft, ChevronRight } from "react-feather";


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
                    <a href="#" className="flex items-center gap-3 no-underline">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-800 to-red-700 flex items-center justify-center">

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

                        {!isCollapsed && (
                            <span className="text-2xl font-bold bg-gradient-to-r from-red-800 to-amber-300 bg-clip-text text-transparent">
                                EVENTORA
                            </span>
                        )}
                    </a>

                    {/* collapsed / expand sidebar */}
                    <button
                        onClick={onToggleCollapse}
                        className="text-amber-200 hover:bg-gray-700 p-2 rounded transition-colors">

                            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}

                    </button>
                </div>

                <div className="p-4 border-b border-gray-700">

                    {!isCollapsed && (
                        <div className="text-amber-200 text-xs uppercase tracking-wider px-4 py-2 opacity-70">
                            Main Menu

                        </div>
                    )}
                </div>

            </aside>
        </>
    )

}
