import React, {useEffect, useState } from "react";


interface DashboardStats {
    userCount: number
    eventCount: number
    vendorCount: number
    bookingCount: number
}

interface ActivityItem {
    id: number
    type: string
    description: string
    date: string
    status: string
}