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


  useEffect(() => {
    loadDashboardData()
    loadSampleData()

  }, [])


  const loadSampleData = () => {
    setActivities(
      [
        { id: 1, type: "User", description: "New guset registered: John Smith", date: "2024-06-20", status: "APPROVED" },
        { id: 2, type: 'Event', description: 'Event created: Summer Wedding', date: '2024-06-19', status: 'PLANNING' },        
        { id: 3, type: 'Booking', description: 'Booking confirmed', date: '2024-06-18', status: 'CONFIRMED' },                
        { id: 4, type: 'Budget', description: 'Budget updated', date: '2024-06-17', status: 'UPDATED' },                       
        { id: 5, type: 'Vendor', description: 'Vendor booking confirmed', date: '2024-06-16', status: 'CONFIRMED' }
      ]
    );
  }

}


