import React, { useEffect, useState } from "react";


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

interface UpcomingEvent {
  id: number
  date: string
  title: string
  status: string
}


const Dashboard: React.FC = () => {

  // intitialize stats satate
  const [stats, setStats] = useState<DashboardStats> ({
    userCount: 0,
    eventCount: 0,
    vendorCount: 0,
    bookingCount: 0
  });

  const [activeTab, setActiveTab] = useState<"overview" | "recent" | "upcoming">("overview")
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([])



}


