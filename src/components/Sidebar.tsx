import React, { act } from "react";
import { Users, Calendar, Clipboard, Home, Bookmark, DollarSign, User, Settings, Menu, ChevronLeft, ChevronRight, LogOut } from "react-feather";
import { NavLink } from "react-router-dom";


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
        { id: "dashboard", icon: Clipboard, label: "Dashboard", path: "/dashboard" },
        { id: "users", icon: Users, label: "Users", path: "/dashboard/users" },
        { id: "events", icon: Calendar, label: "Events", path: "/dashboard/events" },
        { id: "vendors", icon: Home, label: "vendors", path: "/dashboard/vendors" }
    ];

    const managementItems = [
        { id: "booking", icon: Bookmark, label: "Booking", path: "/dashboard/booking" },
        { id: "budgets", icon: DollarSign, label: "Budgets", path: "/dashboard/budgets" },
        { id: "guests", icon: Users, label: "Guests", path: "/dashboard/guests" }
    ];

    const settingsItems = [
        { id: "settings", icon: Settings, label: "Settings", path: "/dashboard/settings" },
        { id: "admin", icon: User, label: "Admin", path: "/dashboard/admin" }
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
                className="lg:hidden fixed top-4 right-4 z-50 bg-gradient-to-br from-[#8B0000]/50 to-[F5F5F5] p-2 rounded-lg shadow-lg border border-[#8B0000]/50 
                            hover:border-[#8B0000]/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center group">

                <div className="p-1 rounded-md bg-gradient-to-br from-[#800000]/10 to-[#800000]/5 group-hover:from-[#8B0000]/20 group-hover:to-[#800000]/10 transition-colors">
                    <Menu className="w-6 h-6 text-[#8B0000]" />
                </div>
            </button>

            {isMobileOpen && (
                <div
                    onClick={handleOverlayClick}
                    className="fixed inset-0 bg-[#1A1A1A]/70 backdrop-blur z-30 lg:hidden">

                </div>
            )}

            <aside
                className={`
                    ${isCollapsed ? "w-22.5" : "w-62"}
                    ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                    fixed lg:relative h-screen bg-[#0A0A0A]/95 text-white transition-all duration-300 z-40
                    flex flex-col border-r border-red-800`}
            >

                <div className="p-6 border-b border-amber-200 flex items-center justify-between">
                    <a href="#" className="flex items-center gap-3 no-underline flex-shrink-0">

                        <div className={`relative flex items-center justify-center
                                    ${isCollapsed ? "w-10 h-10" : "w-12 h-12"}`
                                }>

                            {/* outer gradient circle */}
                            <div className="absolute w-full h-full bg-gradient-to-br from-[#8B0000] via-[#A52A2A] to-[#8b0000] 
                                            rounded-full shadow-x1 shadow-[#8B0000]/30">

                            </div>

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
                            <div className="font-serif text-xl font-bold text-[#F5F5F5] leading-none tracking-wider">

                                <span className="text-[#E6B17E]">EVENT</span>ORA

                            </div>
                        )}
                    </a>


                    {/* collapsed / expand sidebar */}
                    <button
                        onClick={onToggleCollapse}
                        className="text-amber-200 p-2 rounded transition-colors">

                        {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}

                    </button>
                </div>

                {/* main menu items */}
                <div className="p-4 border-b border-gray-800">

                    {!isCollapsed && (
                        <div className="text-[#E6B17E] text-xs uppercase tracking-wider px-4 py-2 opacity-80">
                            Main Menu

                        </div>
                    )}

                    <ul className="space-y-2">

                        {mainMenuItems.map((item) => (
                            <li
                                key={item.id}>
                                <NavLink
                                    to={item.path}
                                    end={item.path === "/dashboard"} 
                                    className={({ isActive }) => 
                                        `flex items-center p-3 rounded-lg transition-colors
                                        ${ 
                                            isActive
                                                ? "bg-gradient-to-br from-[#9B2D2D] to-[#7A1C1C] text-white" // active
                                                : "hover:bg-[#2a2a2a] hover:text-[#f5deb3]" // hover
                                        }`
                                    }
                                    
                                    onClick={() => {
                                        if (isMobileOpen) onToggleMobile()
                                    }}>

                                    <div className={`w-6 flex justify-center ${!isCollapsed ? 'mr-4' : ''}`}>
                                        <item.icon size={20} />
                                    </div>

                                    {!isCollapsed && <span>{item.label}</span>}

                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>


                {/* management menu items */}
                <div className="p-4 border-b border-gray-800">

                    {!isCollapsed && (
                        <div className="text-[#E6B17E] text-xs uppercase tracking-wide px-4 py-2 opacity-70">
                            Management

                        </div>
                    )}

                    <ul className="space-y-2">

                        {managementItems.map((item) => (
                            <li
                                key={item.id}>
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) => 
                                        `flex items-center p-3 rounded-lg transition-colors
                                        ${ 
                                            isActive
                                                ? "bg-gradient-to-br from-[#9B2D2D] to-[#7A1C1C] text-white" // active
                                                : "hover:bg-[#2a2a2a] hover:text-[#f5deb3]" // hover
                                        }`
                                    }
                                    
                                    onClick={() => {
                                        if (isMobileOpen) onToggleMobile()
                                    }}>

                                    <div className={`w-6 flex justify-center ${!isCollapsed ? 'mr-4' : ''}`}>
                                        <item.icon size={20} />
                                    </div>

                                    {!isCollapsed && <span>{item.label}</span>}

                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>


                {/* setting section */}
                <div className="p-4 border-b border-gray-800">

                    {!isCollapsed && (
                        <div className="text-[#E6B17E] text-xs uppercase tracking-wider px-4 py-2 opacity-70">
                            Settings

                        </div>
                    )}

                    <ul className="space-y-2">

                        {settingsItems.map((item) => (
                            <li
                                key={item.id}>
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) => 
                                        `flex items-center p-3 rounded-lg transition-colors
                                        ${ 
                                            isActive
                                                ? "bg-gradient-to-br from-[#9B2D2D] to-[#7A1C1C] text-white" // active
                                                : "hover:bg-[#2a2a2a] hover:text-[#f5deb3]" // hover
                                        }`
                                    }
                                    
                                    onClick={() => {
                                        if (isMobileOpen) onToggleMobile()
                                    }}>

                                    <div className={`w-6 flex justify-center ${!isCollapsed ? 'mr-4' : ''}`}>
                                        <item.icon size={20} />
                                    </div>

                                    {!isCollapsed && <span>{item.label}</span>}

                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>


                {/* Logout Button */}
                <div className="p-4 border-t border-gray-800">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center p-3 rounded-lg text-red-400 hover:bg-gradient-to-br from-[#9B2D2D] to-[#7A1C1C] hover:text-white transition-colors">

                        <div className={`w-6 flex justify-center ${!isCollapsed ? 'mr-4' : ''}`}>
                            <LogOut size={20} />
                        </div>

                        {!isCollapsed && <span>Logout</span>}
                    </button>
                </div>


                {/* user profile */}
                <div className="mt-auto p-5 border-t border-gray-800 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#8B0000] to-[#F5F5F5] flex items-center justify-center font-semibold text-gray-900">
                        JD

                    </div>

                    {!isCollapsed && (
                        <div>
                            <div className="font-semibold">John Doe</div>
                            <div className="text-sm text-[#E6B17E]">Event Manager</div>
                        </div>
                    )}
                </div>
            </aside>
        </>
    )

}


export default Sidebar
