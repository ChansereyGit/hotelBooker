import React, { useState, useEffect } from 'react';
import SidebarNavigation from '../../components/ui/SidebarNavigation';
import UserProfileDropdown from '../../components/ui/UserProfileDropdown';
import NotificationIndicator from '../../components/ui/NotificationIndicator';
import CalendarHeader from './components/CalendarHeader';
import CalendarGrid from './components/CalendarGrid';
import CalendarLegend from './components/CalendarLegend';
import RoomStatusPanel from './components/RoomStatusPanel';

const RoomCalendar = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('weekly');
  const [showLegend, setShowLegend] = useState(false);
  const [filters, setFilters] = useState({
    roomType: 'all',
    status: 'all'
  });

  // Mock rooms data
  const [rooms] = useState([
    {
      id: 1,
      number: '101',
      type: 'standard',
      floor: 1,
      status: 'available',
      baseRate: 120,
      capacity: 2
    },
    {
      id: 2,
      number: '102',
      type: 'standard',
      floor: 1,
      status: 'occupied',
      baseRate: 120,
      capacity: 2
    },
    {
      id: 3,
      number: '103',
      type: 'deluxe',
      floor: 1,
      status: 'available',
      baseRate: 180,
      capacity: 3
    },
    {
      id: 4,
      number: '201',
      type: 'deluxe',
      floor: 2,
      status: 'maintenance',
      baseRate: 180,
      capacity: 3
    },
    {
      id: 5,
      number: '202',
      type: 'suite',
      floor: 2,
      status: 'available',
      baseRate: 350,
      capacity: 4
    },
    {
      id: 6,
      number: '203',
      type: 'suite',
      floor: 2,
      status: 'occupied',
      baseRate: 350,
      capacity: 4
    },
    {
      id: 7,
      number: '301',
      type: 'presidential',
      floor: 3,
      status: 'available',
      baseRate: 750,
      capacity: 6
    },
    {
      id: 8,
      number: '302',
      type: 'deluxe',
      floor: 3,
      status: 'blocked',
      baseRate: 180,
      capacity: 3
    }
  ]);

  // Mock bookings data
  const [bookings, setBookings] = useState([
    {
      id: 1,
      roomId: 2,
      guestName: 'John Smith',
      guestEmail: 'john.smith@email.com',
      checkIn: '2024-10-14',
      checkOut: '2024-10-17',
      status: 'checked-in',
      adults: 2,
      children: 0,
      specialRequests: 'Late check-in requested',
      totalAmount: 360
    },
    {
      id: 2,
      roomId: 6,
      guestName: 'Sarah Johnson',
      guestEmail: 'sarah.johnson@email.com',
      checkIn: '2024-10-13',
      checkOut: '2024-10-16',
      status: 'confirmed',
      adults: 2,
      children: 1,
      specialRequests: 'Extra bed for child',
      totalAmount: 1050
    },
    {
      id: 3,
      roomId: 1,
      guestName: 'Michael Brown',
      guestEmail: 'michael.brown@email.com',
      checkIn: '2024-10-15',
      checkOut: '2024-10-18',
      status: 'pending',
      adults: 1,
      children: 0,
      specialRequests: '',
      totalAmount: 360
    },
    {
      id: 4,
      roomId: 3,
      guestName: 'Emily Davis',
      guestEmail: 'emily.davis@email.com',
      checkIn: '2024-10-16',
      checkOut: '2024-10-19',
      status: 'confirmed',
      adults: 2,
      children: 0,
      specialRequests: 'Ocean view preferred',
      totalAmount: 540
    },
    {
      id: 5,
      roomId: 5,
      guestName: 'Robert Wilson',
      guestEmail: 'robert.wilson@email.com',
      checkIn: '2024-10-17',
      checkOut: '2024-10-20',
      status: 'confirmed',
      adults: 3,
      children: 1,
      specialRequests: 'Anniversary celebration',
      totalAmount: 1050
    }
  ]);

  const handleBookingUpdate = (bookingId, updates) => {
    setBookings(prev => prev?.map(booking => 
      booking?.id === bookingId 
        ? { ...booking, ...updates }
        : booking
    ));
    console.log('Booking updated:', bookingId, updates);
  };

  const handleBookingCreate = (bookingData) => {
    const newBooking = {
      id: Date.now(),
      ...bookingData,
      status: 'pending',
      totalAmount: calculateBookingTotal(bookingData)
    };
    
    setBookings(prev => [...prev, newBooking]);
    console.log('New booking created:', newBooking);
  };

  const calculateBookingTotal = (bookingData) => {
    const room = rooms?.find(r => r?.id === bookingData?.roomId);
    if (!room) return 0;
    
    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    return nights * room?.baseRate;
  };

  const handleRoomStatusUpdate = (roomId, newStatus) => {
    console.log('Update room status:', roomId, newStatus);
    // In a real app, this would update the room status via API
  };

  const handleBulkRoomUpdate = (roomIds, action) => {
    console.log('Bulk room update:', roomIds, action);
    // In a real app, this would perform bulk updates via API
  };

  const handleLogout = () => {
    console.log('User logged out');
    // In a real app, this would handle logout logic
  };

  useEffect(() => {
    // Set up real-time updates listener
    const interval = setInterval(() => {
      // In a real app, this would fetch latest booking updates
      console.log('Checking for real-time updates...');
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar Navigation */}
      <SidebarNavigation 
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-240'} md:ml-240 lg:${sidebarCollapsed ? 'ml-20' : 'ml-240'}`}>
        {/* Top Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Room Calendar</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Visual room availability and booking management
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <NotificationIndicator 
                onMarkAsRead={(id) => console.log('Mark as read:', id)}
                onMarkAllAsRead={() => console.log('Mark all as read')}
              />
              <UserProfileDropdown onLogout={handleLogout} />
            </div>
          </div>
        </header>

        {/* Calendar Content */}
        <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)]">
          {/* Main Calendar Area */}
          <div className="flex-1 flex flex-col min-w-0">
            <CalendarHeader
              currentDate={currentDate}
              onDateChange={setCurrentDate}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              filters={filters}
              onFiltersChange={setFilters}
            />
            
            <CalendarGrid
              rooms={rooms}
              bookings={bookings}
              currentDate={currentDate}
              viewMode={viewMode}
              filters={filters}
              onBookingUpdate={handleBookingUpdate}
              onBookingCreate={handleBookingCreate}
            />
          </div>

          {/* Room Status Panel */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <RoomStatusPanel
              rooms={rooms}
              onRoomStatusUpdate={handleRoomStatusUpdate}
              onBulkUpdate={handleBulkRoomUpdate}
            />
          </div>
        </div>
      </div>

      {/* Calendar Legend */}
      <CalendarLegend
        isVisible={showLegend}
        onToggle={() => setShowLegend(!showLegend)}
      />
    </div>
  );
};

export default RoomCalendar;