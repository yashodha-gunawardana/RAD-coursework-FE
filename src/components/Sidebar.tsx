import React, { act, useState } from "react";
import { Users, Calendar, Clipboard, Home, Bookmark, DollarSign, User } from "react-feather";


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
        { id: "admin", icon: User, label: "Admin" }
    ];

}
