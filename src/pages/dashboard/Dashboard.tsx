import React, { useEffect, useState } from "react";
import { Activity, BarChart2, Bookmark, Calendar, DollarSign, Home, List, PieChart, Plus, RefreshCw, ThumbsUp, User, UserPlus, Users, Zap } from "react-feather";


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
        { id: 2, type: "Event", description: "Event created: Summer Wedding", date: "2024-06-19", status: "PLANNING" },        
        { id: 3, type: "Booking", description: "Booking confirmed", date: "2024-06-18", status: "CONFIRMED" },                
        { id: 4, type: "Budget", description: "Budget updated", date: "2024-06-17", status: "UPDATED" },                       
        { id: 5, type: "Vendor", description: "Vendor booking confirmed", date: "2024-06-16", status: "CONFIRMED" }
      ]
    );

    setUpcomingEvents(
      [
        { id: 1, date: "Jun 24", title: "Summer Wedding", status: "PLANNING" },      
        { id: 2, date: "Jul 12", title: "Corporate Conference", status: "ONGOING" }, 
        { id: 3, date: "Aug 5", title: "Birthday Bash", status: "PLANNING" },        
        { id: 4, date: "Oct 15", title: "Product Launch", status: "PLANNING" }
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
    switch (status.toLowerCase()) {

      case "planning":
        return "bg-blue-100 text-blue-800 border border-blue-200";

      case "ongoing":                   
      case "confirmed":                 
      case "approved":                  
        return "bg-green-100 text-green-800 border border-green-200";  

      case "completed":                
        return "bg-gray-100 text-gray-800 border border-gray-200";     

      default:                          
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
    }
  };

  
  // array of quick action btn
  const quickActions = [
    {
      label: "Create New Event",        
      icon: Plus,                     
      onClick: handleCreateNewEvent,    
      primary: true  
    },

    {
      label: "Add Booking",        
      icon: Bookmark,                     
      onClick: handleCreateNewEvent,    
      primary: false  
    },

    {
      label: "Invite Guests",        
      icon: User,                     
      onClick: handleCreateNewEvent,    
      primary: false  
    },

    {
      label: "Add Vendor",        
      icon: Home,                     
      onClick: handleCreateNewEvent,    
      primary: false  
    },

    {
      label: "Create Budget",        
      icon: DollarSign,                     
      onClick: handleCreateNewEvent,    
      primary: false  
    },
  ];


  // stats cards
  const statsCards = [
    { icon: Users, value: stats.userCount, label: "Total Users" },
    { icon: Calendar, value: stats.eventCount, label: "Total Events" },
    { icon: Home, value: stats.vendorCount, label: "Available Vendors" },
    { icon: Bookmark, value: stats.bookingCount, label: "Confirmed Bookings" },

  ];


  return (
    <main className="flex-1 p-4 md:p-6 lg:p-8">

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6
                      md:mb-8 pb-4 border-b border-gray-200">

          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-red-800 mb-4 md:mb-0">
            Dashboard Overview

          </h1>

          <button
              onClick={refreshDashboard}
              className="bg-white border border-gray-300 text-gray-800 px-4 md:px-6 py-2 md:py-3
                          rounded-lg shadow-sm hover:bg-gray-50 hover:shadow-md transition-all flex items-center gap-2">
 
                <RefreshCw className="w-4 h-4" />

                  Refresh
          </button>
      </div>

      {/* stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">

        {statsCards.map((stat, index) => (
          <div
              key={index}
              className="bg-white rounded-xl p-4 md:p-6 shadow-lg border border-gray-100 hover:shadow-xl
                          hover:translate-y-1 transition-all duration-300 text-center">

              <div className="text-3xl md:text-4xl text-red-800 mb-3 md:mb-4">

                <stat.icon className="w-4 h-4 md:w-7 md:h-7" />
              </div>

              <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 md:mb-2">

                {stat.value}

              </div>

              <div className="text-gary-600 font-medium text-sm md:text-base">

                {stat.label}

              </div>
          </div>
        ))}
      </div>

      {/* main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-1 bg-white rounded-xl p-4 md:p-6 shadow-lg border border-gray-100">

          <h3 className="text-lg md:text-xl font-bold text-red-800 mb-4 md:mb-6 pb-2 md:pb-3 boredr-b border-amber-100
                          flex items-center gap-2">

              <Zap className="w-8 h-8 md:w-7 md:h-7" />

                  Quick Actions
          </h3>

          <div className="space-y-2 md:space-y-3">

            {quickActions.map((action, index) => (
              <button
                    key={index}
                    onClick={action.onClick}
                    className={`w-full px-4 md:px-5 py-2 md:py-3 rounded-lg transition-all duration-300 flex
                                items-center gap-2 md:gap-3 text-sm md:text-base
                                ${action.primary
                                
                                  ? "bg-red-800 text-white shadow-lg hover:bg-red-700 hover:shadow-xl hover:-translate-y-1"
                                  : "bg-gray-50 text-gray-800 border border-gray-300 hover:bg-amber-50 hover:border-amber-200 hover:text-gray-900 hover:-translate-y-1"
                                }`}>

                        <action.icon className="w-4 h-4 md:w-6 md:h-6" />
                        {action.label}
                </button>
            ))}
          </div>
        </div>


        {/* right column */}
        <div className="lg:col-span-2 bg-white rounded-xl p-4 md:p-6 shadow-lg border border-gray-100">
          <div className="flex border-b border-gray-200 mb-4 md:mb-6 overflow-x-auto">

            {["overview", "recent", "upcoming"].map((tab) => (
              <button
                    key={tab}
                    onClick={() => handleTabSwitch(tab as any)}
                    className={`px-4 md:px-6 py-2 md:py-3 font-medium whitespace-nowrap border-b-3 transition-colors
                                text-sm md:text-base ${activeTab === tab

                                  ? "text-red-800 border-red-800 bg-red-50"
                                  : "text-gray-500 border-transparent hover:text-red-700 hover:bg-red-50"
                                }`}>

                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>


          {/* active tab */}
          <div className="space-y-4 md:space-y-6">

            {/* overview tab */}
            {activeTab === "overview" && (
              <div>
                  <h3 className="text-lg md:text-xl font-bold text-red-800 mb-3 md:mb-4 flex items-center gap-2">

                    <BarChart2 className="w-8 h-8 md:w-7 md:h-7" />
                      
                      Events by Status

                  </h3>

                  <div className="bg-gradient-to-br from-amber-50 to-gray-50 rounded-xl p-4 md:p-6 lg:p-8 border border-gray-200">
                    <div className="text-container">

                      <PieChart className="text-red-800 text-4xl md:text-5xl mb-4 md:mb-6 opacity-70" />

                      <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">
                        Chart showing distribution of events by status
                      </p>

                      <div className="flex flex-wrap gap-2 md:gap-3 justify-center">

                        <span className="px-3 md:px-4 py-1 md:py-2 rounded-full bg-blue-100 text-blue-800 border border-blue-200 font-semibold text-sm">
                          PLANNING: 8
                        </span>
                        <span className="px-3 md:px-4 py-1 md:py-2 rounded-full bg-green-100 text-green-800 border border-green-200 font-semibold text-sm">
                          ONGOING: 3
                        </span>
                        <span className="px-3 md:px-4 py-1 md:py-2 rounded-full bg-gray-100 text-gray-800 border border-gray-200 font-semibold text-sm">
                          COMPLETED: 1
                        </span>
                      </div>
                    </div>
                  </div>
              </div>
            )}


            {/* recent activity tab */}
            {activeTab === "recent" && (
              <>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-red-800 mb-3 md:mb-4 flex items-center gap-2">
                    
                    <Activity className="w-8 h-8 md:w-7 md:h-7" />

                      Recent System Activity

                  </h3>

                  <div className="bg-gradient-to-br from-amber-50 to-gray-50 rounded-xl p-4 md:p-6 lg:p-8 border border-gray-200">
                    <div className="text-center">

                      <List className="text-red-800 text-4xl md:text-5xl mb-4 md:mb-6 opacity-70" />

                      <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">
                        Timeline of recent activities across all modules
                      </p>

                      <div className="max-w-md mx-auto text-left space-y-2 md:space-y-3">

                        <p className="flex items-center gap-2 text-sm md:text-base">
                          <UserPlus className="text-green-500" />
                            <span>5 new guests added (Today)</span>
                        </p>

                        <p className="flex items-center gap-2 text-sm md:text-base">
                          <Calendar className="text-blue-500" />
                            <span>New event created (Yesterday)</span>
                        </p>

                        <p className="flex items-center gap-2 text-sm md:text-base">
                          <DollarSign className="text-yellow-500" />
                            <span>Budget updated (2 days ago)</span>
                        </p>

                        <p className="flex items-center gap-2 text-sm md:text-base">
                          <ThumbsUp className="text-red-800" />
                            <span>Vendor booking confirmed (3 days ago)</span>
                        </p>

                      </div>
                    </div>
                  </div>
                </div>

                {/* detail acitivity */}
                <div>
                   <h3 className="text-lg md:text-xl font-bold text-red-800 mb-3 md:mb-4">

                    Detailed Activity Log

                  </h3>

                  <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200">

                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[640px]">
                        <thead className="bg-gray-100">

                          <tr>

                            <th className="p-3 md:p-4 text-left font-semibold text-gray-700 text-sm md:text-base">
                              Type
                            </th>

                            <th className="p-3 md:p-4 text-left font-semibold text-gray-700 text-sm md:text-base">
                              Description
                            </th>

                            <th className="p-3 md:p-4 text-left font-semibold text-gray-700 text-sm md:text-base">
                              Date
                            </th>

                            <th className="p-3 md:p-4 text-left font-semibold text-gray-700 text-sm md:text-base">
                              Status
                            </th>

                          </tr>

                        </thead>

                        <tbody>

                          {activities.map((activity) => (
                            <tr 
                                key={activity.id}
                                className="hover:bg-amber-50 transition-colors">

                                <td className="p-3 md:p-4 font-semibold text-sm md:text-base">

                                  {activity.type}

                                </td>

                                <td className="p-3 md:p-4 text-sm md:text-base">
                                  
                                  {activity.description}
                                </td>

                                <td className="p-3 md:p-4 text-sm md:text-base">
                                  
                                  {activity.date}
                                </td>

                                <td className="p-3 md:p-4">
                                  <span className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold ${getStatusBadgeClass(activity.status)}`}>
                                  
                                    {activity.status}

                                  </span>
                                </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </>
            )}


            {/* upcoming event tab */}
            {activeTab === "upcoming" && (
              <div>
                <h3 className="text-lg md:text-xl font-bold text-red-800 mb-3 md:mb-4 flex items-center gap-2">

                  <Calendar className="w-8 h-8 md:w-7 md:h-7" />

                    Upcoming Events Timeline

                </h3>

                <div className="bg-gradient-to-br from-amber-50 to-gray-50 rounded-xl p-4 md:p-6 lg:p-8 border border-gray-200">
                  <div className="text-center">

                    <Calendar className="text-red-800 text-4xl md:text-5xl mb-4 md:mb-6 opacity-70" />
                    
                    <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">
                      Timeline view of upcoming events
                    </p>

                    <div className="max-w-md mx-auto space-y-3 md:space-y-4">

                      {upcomingEvents.map((event) => (
                        <div
                            key={event.id}
                            className="p-3 md:p-4 bg-white rounded-lg shadow-sm border border-gray-200">

                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                            
                            <span className="font-bold text-gray-900 text-sm md:text-base">

                              {event.date}:

                            </span>
                            
                            <span className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold ${getStatusBadgeClass(event.status)}`}>
                              
                              {event.status}

                            </span>
                          </div>

                          <div className="mt-1 md:mt-2 text-gray-700 text-sm md:text-base">

                            {event.title}

                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )

}

export default Dashboard


