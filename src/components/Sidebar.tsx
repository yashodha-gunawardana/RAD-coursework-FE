import React, { act, useState } from "react";
import { Users, Calendar, Clipboard, Home } from "react-feather";


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
    ]

}
