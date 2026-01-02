import React, { useCallback, useEffect, useState } from "react";
import { Activity, BarChart2, Bookmark, Calendar, ChevronRight, DollarSign, Home, List, PieChart, Plus, RefreshCw, ThumbsUp, User, UserPlus, Users, Zap } from "react-feather";
import { useAuth } from "../../context/authContext";
import { requestVendor, getMyDetails } from "../../services/auth";


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

interface ToastState {
    show: boolean
    message: string
    type: "success" | "error"
}


const Dashboard: React.FC = () => {
  const { user, setUser } = useAuth()

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
  const [vendorModal, setShowVendorModal] = useState(false)
  const [isRequesting, setIsRequesting] = useState(false)

  const [toast, setToast] = useState<ToastState>({ show: false, message: " ", type: "success" })
  

  // toast notification
  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    setToast({ show: true, message, type })
      setTimeout(() =>{
        setToast(prev => ({ ...prev, show: false }))
    }, 3000)
  }, [])


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
    showToast("Dashboard data refreshed!", "success")
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
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";     

      default:                          
        return "bg-orange-100 text-orange-800 border border-orange-200";
    }
  };


  // vendor request
  const handleVendorRequest = async () => {
    setIsRequesting(true)
    
    try {
      await requestVendor()
      const updated = await getMyDetails()
      setUser(updated.data)
      setShowVendorModal(true)
    
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to send vendor request", "error")
    
    } finally {
      setIsRequesting(false)
    }
  }
  
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
    <main className="relative flex-1 p-4 md:p-6 lg:p-8 bg-gradient-to-br from-[#F8F5F0] to-[#E8E3D8]">

      {/* circle */}
      <div className='absolute -top-[200px] -left-[200px] h-[600px] w-[600px] rounded-full border-[120px]
                            border-[rgba(139,0,0,0.04)] pointer-events-none z-0'
        aria-hidden='true'>
      </div>

      <div className='absolute -bottom-[200px] -right-[200px] h-[700px] w-[700px] rounded-full border-[140px] 
                            border-[rgba(139,0,0,0.03)] pointer-events-none z-0'
        aria-hidden='true'>
      </div>


      <div className="relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8
                        md:mb-8 pb-5">

          <div className="absolute top-35 right-0 h-[2px] w-full bg-[#0A0A0A]/50 opacity-80 md:top-40"></div>


          <div className="flex flex-col items-start gap-1">

            {/* Welcome span with lines */}
            <div className="flex items-center gap-2">
              <div className="w-16 h-px bg-gradient-to-r from-[#9B2D2D] via-[#D4B483] to-[#9B2D2D]" />

              <span className="font-[Poppins] text-xs uppercase tracking-[0.3em] font-semibold text-[#9B2D2D]">
                Welcome, Eventora Team
              </span>

              <div className="w-16 h-px bg-gradient-to-r from-[#9B2D2D] via-[#D4B483] to-[#9B2D2D]" />
            </div>

            {/* Heading on top */}
            <h1 className="font-[poppins] text-3xl md:text-6xl leading-[1.2] font-semibold">
              <span className="text-[#9B2D2D]">Events</span>
              <span className="text-[#D4B483]"> Inspire</span>
              <span className="text-[#9B2D2D]"> Everyone</span>
            </h1>

            <p className="text-[#0F0F0F]/80 leading-relaxed text-l">
              Discover, organize, and enjoy every event with ease and elegance.
              Your dashboard gives you a quick overview of all activities.
            </p>
          </div>

          <button
            onClick={refreshDashboard}
            className="bg-gradient-to-br from-[#E6B17E]/15 to-[#8B0000]/15 
                        border border-[#8B0000]/20 text-gray-800 p-3 
                        rounded-full shadow-lg hover:shadow-xl 
                        hover:from-[#E6B17E]/25 hover:to-[#8B0000]/25 
                        hover:scale-110 hover:shadow-xl hover:shadow-[#E6B17E]/20 group
                        transition-all duration-200 flex items-center justify-center
                        hover:border-[#F5F5F5]/20">

            <RefreshCw className="w-5 h-5 text-[#8B0000] hover:rotate-180 
                                  transition-transform duration-700" />
          </button>
        </div>

        {/* stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          {statsCards.map((stat, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-[#F5F5F5] via-white to-[#E6D5B8]/30 
                        rounded-xl p-4 md:p-6 shadow-lg border border-[#E6D5B8]/50 
                        hover:shadow-2xl hover:border-[#800000]/20
                        hover:-translate-y-1 transition-all duration-500 
                        group relative overflow-hidden text-center
                        before:absolute before:inset-0 before:bg-gradient-to-br 
                        before:from-[#800000]/5 before:to-[#E6D5B8]/10 
                        before:opacity-0 before:group-hover:opacity-100 
                        before:transition-opacity before:duration-500">

              {/* Crimson accent line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r 
                     from-[#800000]/0 via-[#800000] to-[#800000]/0 
                     transform scale-x-0 group-hover:scale-x-100 
                     transition-transform duration-500 z-20" />

              <div className="relative z-10">

                <div className="text-3xl md:text-4xl mb-3 md:mb-4">
                  <div className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 
                         rounded-lg bg-gradient-to-br from-[#800000]/15 to-[#800000]/5
                         group-hover:from-[#800000]/20 group-hover:to-[#800000]/10
                         transition-all duration-300 relative">

                    <div className="absolute inset-0 bg-[#800000]/5 blur-md 
                           group-hover:bg-[#800000]/10 transition-colors 
                           duration-300 rounded-lg" />
                    <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-[#800000] 
                         relative z-10" />
                  </div>
                </div>

                <div className="text-2xl md:text-3xl lg:text-4xl font-bold 
                       text-[#1A1A1A] mb-1 md:mb-2">
                  {stat.value}
                </div>

                <div className="text-[#1A1A1A]/70 font-medium text-sm md:text-base 
                       tracking-wide">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>


        {/* main content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 lg:sticky lg:top-6 self-start bg-gradient-to-b from-[#F5F5F5] to-white rounded-xl p-4 md:p-6 shadow-lg border border-[#E6D5B8]/30">

            <h3 className="text-lg md:text-xl font-bold text-[#1A1A1A] mb-4 md:mb-6 pb-2 md:pb-3 border-b border-[#E6D5B8]/50
                flex items-center gap-2">

              <div className="p-2 rounded-lg bg-gradient-to-br from-[#800000]/10 to-[#800000]/5">
                <Zap className="w-5 h-5 md:w-6 md:h-6 text-[#800000]" />
              </div>

              <span>Quick Actions</span>
            </h3>

            <div className="space-y-2 md:space-y-3">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={`w-full px-4 md:px-5 py-2.5 md:py-3 rounded-lg transition-all duration-300 flex
                      items-center gap-2 md:gap-3 text-sm md:text-base font-medium
                      relative overflow-hidden group
                      ${action.primary
                      ? "bg-gradient-to-r from-[#800000] to-[#800000]/90 text-[#F5F5F5] shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98]"
                      : "bg-[#F5F5F5] text-[#1A1A1A] border border-[#E6D5B8]/40 hover:bg-gradient-to-r hover:from-[#E6D5B8]/10 hover:to-[#E6D5B8]/5 hover:border-[#E6D5B8]/60 hover:-translate-y-0.5 active:scale-[0.98]"
                    }`}>

                  {/* Hover effect overlay for primary buttons */}
                  {action.primary && (
                    <div className="absolute inset-0 bg-gradient-to-r from-[#800000]/0 via-white/10 to-[#800000]/0 
                         translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  )}

                  {/* Hover effect for secondary buttons */}
                  {!action.primary && (
                    <div className="absolute inset-0 bg-gradient-to-r from-[#E6D5B8]/0 via-[#E6D5B8]/5 to-[#E6D5B8]/0 
                         translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  )}

                  <div className={`p-1.5 rounded-md ${action.primary
                    ? 'bg-[#F5F5F5]/20'
                    : 'bg-[#800000]/10 group-hover:bg-[#800000]/15'}`}>
                    <action.icon className={`w-3.5 h-3.5 md:w-4 md:h-4 ${action.primary
                      ? 'text-[#F5F5F5]'
                      : 'text-[#800000]'}`} />
                  </div>

                  <span className="relative z-10">{action.label}</span>

                  <ChevronRight className={`w-3.5 h-3.5 md:w-4 md:h-4 ml-auto transition-transform duration-300 
                                 ${action.primary ? 'text-[#F5F5F5]/80' : 'text-[#1A1A1A]/50'} 
                                 group-hover:translate-x-1 ${!action.primary && 'group-hover:text-[#800000]'}`} />
                </button>
              ))}
            </div>
          </div>


          {/* right column */}
          <div className="lg:col-span-3 bg-white rounded-xl p-4 md:p-6 shadow-lg border border-[#E6D5B8]/30">
            <div className="flex border-b border-[#E6D5B8]/40 mb-4 md:mb-6 overflow-x-auto">
              
              {["overview", "recent", "upcoming"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabSwitch(tab as any)}
                  className={`px-4 md:px-6 py-2 md:py-3 font-medium whitespace-nowrap border-b-3 transition-all duration-300
                              text-sm md:text-base relative overflow-hidden group
                              ${activeTab === tab
                                ? "text-[#800000] border-[#800000] bg-gradient-to-r from-[#800000]/5 to-[#800000]/10"
                                : "text-[#1A1A1A]/60 border-transparent hover:text-[#800000] hover:bg-gradient-to-r hover:from-[#E6D5B8]/5 hover:to-[#E6D5B8]/10"
                              }`}>

                  {/* Active tab indicator */}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#800000]/0 via-[#800000] to-[#800000]/0" />
                  )}

                  {/* Hover effect */}
                  <div className={`absolute inset-0 ${activeTab === tab
                    ? 'bg-gradient-to-r from-[#800000]/10 via-[#800000]/5 to-[#800000]/10'
                    : 'group-hover:bg-gradient-to-r group-hover:from-[#E6D5B8]/10 group-hover:via-[#E6D5B8]/5 group-hover:to-[#E6D5B8]/10'} 
                        transition-colors duration-300`} />

                  <span className="relative z-10">
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </span>

                </button>
              ))}
            </div>

            {/* Active tab content */}
            <div className="space-y-4 md:space-y-6">
              {/* Overview tab */}
              {activeTab === "overview" && (
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-[#1A1A1A] mb-3 md:mb-4 flex items-center gap-2">
                    
                    <div className="p-2 rounded-lg bg-gradient-to-br from-[#800000]/10 to-[#800000]/5">
                      
                      <BarChart2 className="w-5 h-5 md:w-6 md:h-6 text-[#800000]" />

                    </div>

                    Events by Status
                  </h3>

                  <div className="bg-gradient-to-br from-[#F5F5F5] via-white to-[#E6D5B8]/20 rounded-xl p-4 md:p-6 lg:p-8 border border-[#E6D5B8]/40">
                    <div className="text-center">
                      
                      <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-[#800000]/10 to-[#800000]/5 mb-4 md:mb-6">
                        
                        <PieChart className="text-[#800000] w-8 h-8 md:w-10 md:h-10" />

                      </div>

                      <p className="text-[#1A1A1A]/70 mb-4 md:mb-6 text-sm md:text-base">
                        Chart showing distribution of events by status
                      </p>

                      <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
                        
                        <span className="px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 border border-blue-200 font-semibold text-sm shadow-sm">
                          PLANNING: 8
                        </span>

                        <span className="px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-gradient-to-r from-green-100 to-green-50 text-green-800 border border-green-200 font-semibold text-sm shadow-sm">
                          ONGOING: 3
                        </span>

                        <span className="px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-800 border border-yellow-200 font-semibold text-sm shadow-sm">
                          COMPLETED: 1
                        </span>

                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Recent activity tab */}
              {activeTab === "recent" && (
                <>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-[#1A1A1A] mb-3 md:mb-4 flex items-center gap-2">
                      
                      <div className="p-2 rounded-lg bg-gradient-to-br from-[#800000]/10 to-[#800000]/5">
                        
                        <Activity className="w-5 h-5 md:w-6 md:h-6 text-[#800000]" />

                      </div>
                      Recent System Activity
                    </h3>

                    <div className="bg-gradient-to-br from-[#F5F5F5] via-white to-[#E6D5B8]/20 rounded-xl p-4 md:p-6 lg:p-8 border border-[#E6D5B8]/40">
                      <div className="text-center">

                        {/* Changed: Square container instead of circle */}
                        <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-xl bg-gradient-to-br from-[#800000]/10 to-[#800000]/5 mb-4 md:mb-6 border border-[#800000]/20">
                          
                          <List className="text-[#800000] w-8 h-8 md:w-10 md:h-10" />

                        </div>

                        <p className="text-[#1A1A1A]/70 mb-4 md:mb-6 text-sm md:text-base">
                          Timeline of recent activities across all modules
                        </p>

                        {/* Changed: Grid layout instead of single column */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 max-w-3xl mx-auto">
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-white border border-[#E6D5B8]/40 hover:shadow-md hover:border-[#800000]/30 transition-all duration-300">
                            <div className="p-2 rounded-lg bg-green-100 border border-green-200">
                              
                              <UserPlus className="text-green-600 w-4 h-4 md:w-5 md:h-5" />

                            </div>

                            <span className="text-[#1A1A1A] text-sm md:text-base">5 new guests added (Today)</span>
                          </div>

                          <div className="flex items-center gap-3 p-3 rounded-lg bg-white border border-[#E6D5B8]/40 hover:shadow-md hover:border-[#800000]/30 transition-all duration-300">
                            <div className="p-2 rounded-lg bg-blue-100 border border-blue-200">
                              
                              <Calendar className="text-blue-600 w-4 h-4 md:w-5 md:h-5" />

                            </div>

                            <span className="text-[#1A1A1A] text-sm md:text-base">New event created (Yesterday)</span>
                          </div>

                          <div className="flex items-center gap-3 p-3 rounded-lg bg-white border border-[#E6D5B8]/40 hover:shadow-md hover:border-[#800000]/30 transition-all duration-300">
                            <div className="p-2 rounded-lg bg-yellow-100 border border-yellow-200">
                              
                              <DollarSign className="text-yellow-600 w-4 h-4 md:w-5 md:h-5" />

                            </div>

                            <span className="text-[#1A1A1A] text-sm md:text-base">Budget updated (2 days ago)</span>
                          </div>

                          <div className="flex items-center gap-3 p-3 rounded-lg bg-white border border-[#E6D5B8]/40 hover:shadow-md hover:border-[#800000]/30 transition-all duration-300">
                            <div className="p-2 rounded-lg bg-[#800000]/10 border border-[#800000]/20">
                              
                              <ThumbsUp className="text-[#800000] w-4 h-4 md:w-5 md:h-5" />

                            </div>

                            <span className="text-[#1A1A1A] text-sm md:text-base">Vendor booking confirmed (3 days ago)</span>
                          </div>
                          
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Detailed activity */}
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-[#1A1A1A] mb-3 md:mb-4">
                      Detailed Activity Log
                    </h3>

                    <div className="bg-[#F5F5F5] rounded-xl overflow-hidden border border-[#E6D5B8]/40">
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px]">
                          <thead className="bg-gradient-to-r from-[#F5F5F5] to-white">
                            <tr>
                              
                              <th className="p-3 md:p-4 text-left font-semibold text-[#1A1A1A] text-sm md:text-base border-b border-[#E6D5B8]/40">
                                Type
                              </th>

                              <th className="p-3 md:p-4 text-left font-semibold text-[#1A1A1A] text-sm md:text-base border-b border-[#E6D5B8]/40">
                                Description
                              </th>

                              <th className="p-3 md:p-4 text-left font-semibold text-[#1A1A1A] text-sm md:text-base border-b border-[#E6D5B8]/40">
                                Date
                              </th>

                              <th className="p-3 md:p-4 text-left font-semibold text-[#1A1A1A] text-sm md:text-base border-b border-[#E6D5B8]/40">
                                Status
                              </th>
                              
                            </tr>
                          </thead>

                          <tbody>
                            {activities.map((activity) => (
                              <tr
                                key={activity.id}
                                className="hover:bg-gradient-to-r hover:from-[#E6D5B8]/10 hover:to-[#E6D5B8]/5 transition-colors border-b border-[#E6D5B8]/30 last:border-b-0">
                                
                                <td className="p-3 md:p-4 font-semibold text-[#1A1A1A] text-sm md:text-base">
                                  
                                  {activity.type}

                                </td>

                                <td className="p-3 md:p-4 text-[#1A1A1A]/80 text-sm md:text-base">
                                  
                                  {activity.description}

                                </td>

                                <td className="p-3 md:p-4 text-[#1A1A1A]/70 text-sm md:text-base">
                                
                                 {activity.date}

                                </td>

                                <td className="p-3 md:p-4">
                                  <span className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold border shadow-sm
                                                    ${getStatusBadgeClass(activity.status)
                                                  
                                                  }`}>
                                    
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

              {/* Upcoming event tab */}
              {activeTab === "upcoming" && (
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-[#1A1A1A] mb-3 md:mb-4 flex items-center gap-2">
                    
                    <div className="p-2 rounded-lg bg-gradient-to-br from-[#800000]/10 to-[#800000]/5">
                      
                      <Calendar className="w-5 h-5 md:w-6 md:h-6 text-[#800000]" />

                    </div>
                    Upcoming Events Timeline
                  </h3>

                  <div className="bg-gradient-to-br from-[#F5F5F5] via-white to-[#E6D5B8]/20 rounded-xl p-4 md:p-6 lg:p-8 border border-[#E6D5B8]/40">
                    <div className="text-center">
                      
                      <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-[#800000]/10 to-[#800000]/5 mb-4 md:mb-6">
                        
                        <Calendar className="text-[#800000] w-8 h-8 md:w-10 md:h-10" />

                      </div>

                      <p className="text-[#1A1A1A]/70 mb-4 md:mb-6 text-sm md:text-base">
                        Timeline view of upcoming events
                      </p>

                      {/* Changed to row layout - grid with responsive columns */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {upcomingEvents.map((event) => (
                          <div
                            key={event.id}
                            className="p-4 bg-white rounded-xl shadow-sm border border-[#E6D5B8]/40 hover:shadow-md hover:border-[#800000]/30 hover:-translate-y-0.5 
                                      transition-all duration-300">
                            
                            <div className="flex flex-col gap-2 mb-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  
                                  <Calendar className="w-4 h-4 text-[#800000]" />

                                  <span className="font-bold text-[#1A1A1A] text-sm md:text-base">
                                    
                                    {event.date}:

                                  </span>
                                </div>

                                <span className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold border shadow-sm
                                                  ${getStatusBadgeClass(event.status

                                                  )}`}>
                                  
                                  {event.status}

                                </span>
                              </div>
                            </div>

                            <div className="mt-1 md:mt-2 text-[#1A1A1A]/80 text-sm md:text-base">
                              
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
      </div>
    </main>
  )

}

export default Dashboard


