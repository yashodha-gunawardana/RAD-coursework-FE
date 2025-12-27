import React, { act } from "react";
import { Users, Calendar, Clipboard, Home, Bookmark, DollarSign, User, Settings, Menu, ChevronLeft, ChevronRight, LogOut } from "react-feather";


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
        { id: "dashboard", icon: Clipboard, label: "Dashboard", active: false },
        { id: "users", icon: Users, label: "Users", active: false },
        { id: "events", icon: Calendar, label: "Events", active: false },
        { id: "vendors", icon: Home, label: "vendors", active: false}
    ];

    const managementItems = [
        { id: "booking", icon: Bookmark, label: "Booking", active: false },
        { id: "budgets", icon: DollarSign, label: "Budgets", active: false },
        { id: "guests", icon: Users, label: "Guests", active: false }
    ];

    const settingsItems = [
        { id: "settings", icon: Settings, label: "Settings", active: false },
        { id: "admin", icon: User, label: "Admin", active: false }
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

                <Menu className="w-8 h-8" />
            </button>

            {isMobileOpen && (
                <div
                    onClick={handleOverlayClick}
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden">

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
                                <a href="#" className={`flex items-center p-3 rounded-lg transition-colors
                                        ${item.active
                                        ? "bg-gradient-to-br from-[#9B2D2D] to-[#7A1C1C] text-white" // active
                                        : "hover:bg-[#2a2a2a] hover:text-[#f5deb3]" // hover
                                    }`}>

                                    <div className={`w-6 flex justify-center ${!isCollapsed ? 'mr-4' : ''}`}>
                                        <item.icon size={20} />
                                    </div>

                                    {!isCollapsed && <span>{item.label}</span>}
                                </a>
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
                                <a href="#" className={`flex items-center p-3 rounded-lg transition-colors
                                        ${item.active
                                        ? "bg-gradient-to-br from-[#9B2D2D] to-[#7A1C1C] text-white" // active
                                        : "hover:bg-[#2a2a2a] hover:text-[#f5deb3]" // hover
                                    }`}>

                                    <div className={`w-6 flex justify-center ${!isCollapsed ? 'mr-4' : ''}`}>
                                        <item.icon size={20} />
                                    </div>

                                    {!isCollapsed && <span>{item.label}</span>}
                                </a>
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
                                <a href="#" className={`flex items-center p-3 rounded-lg transition-colors
                                        ${item.active
                                        ? "bg-gradient-to-br from-[#9B2D2D] to-[#7A1C1C] text-white" // active
                                        : "hover:bg-[#2a2a2a] hover:text-[#f5deb3]" // hover
                                    }`}>

                                    <div className={`w-6 flex justify-center ${!isCollapsed ? 'mr-4' : ''}`}>
                                        <item.icon size={20} />
                                    </div>

                                    {!isCollapsed && <span>{item.label}</span>}
                                </a>
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
