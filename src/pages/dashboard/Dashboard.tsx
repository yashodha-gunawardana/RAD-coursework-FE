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

    setUpcomingEvents(
      [
        { id: 1, date: 'Jun 24', title: 'Summer Wedding', status: 'PLANNING' },      
        { id: 2, date: 'Jul 12', title: 'Corporate Conference', status: 'ONGOING' }, 
        { id: 3, date: 'Aug 5', title: 'Birthday Bash', status: 'PLANNING' },        
        { id: 4, date: 'Oct 15', title: 'Product Launch', status: 'PLANNING' }
      ]
    );
  };

  // dashboard statistics function
  const loadDashboardData = () => {
    setStats({
      userCount: 125,
      eventCount: 12,
      vendorCount: 45,
      bookingCount: 40
    })
  };


  // quick actions handler
  const handleCreateNewEvent = () => {
    alert("Create New Event - This would open the event creation form")
  };

  const handleAddBooking = () => {
    alert("Add Booking - This would open the booking creation form")
  };

  const handleInviteGuests = () => {
    alert("Invite Guests - This would open the guests invitation form")
  };

  const handleAddVendor = () => {
    alert("Add Vendor - This would open the vendor creation form")
  };

  const handleCreateBudget = () => {
    alert("Create Budget - This would open the budget creation form")
  };


  // refresh button 
  const refreshDashboard = () => {
    loadDashboardData()
    alert("Dashboard data refreshed!")
  };


  const handleTabSwitch = (tab: "overview" | "recent" | "upcoming") => {
    setActiveTab(tab) // update active tab state
  };

  const getStatusBadgeClass = (status: string) => {
    
  }

}


