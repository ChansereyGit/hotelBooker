import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import BookingBlock from './BookingBlock';
import QuickBookingModal from './QuickBookingModal';

const CalendarGrid = ({ 
  rooms, 
  bookings, 
  currentDate, 
  viewMode, 
  filters,
  onBookingUpdate,
  onBookingCreate 
}) => {
  const [selectedCell, setSelectedCell] = useState(null);
  const [showQuickBooking, setShowQuickBooking] = useState(false);

  // Generate date range based on view mode
  const generateDateRange = () => {
    const dates = [];
    const startDate = new Date(currentDate);
    
    if (viewMode === 'daily') {
      dates?.push(new Date(startDate));
    } else if (viewMode === 'weekly') {
      startDate?.setDate(startDate?.getDate() - startDate?.getDay());
      for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date?.setDate(startDate?.getDate() + i);
        dates?.push(date);
      }
    } else { // monthly
      startDate?.setDate(1);
      const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
      for (let i = 1; i <= endDate?.getDate(); i++) {
        const date = new Date(startDate.getFullYear(), startDate.getMonth(), i);
        dates?.push(date);
      }
    }
    
    return dates;
  };

  const dateRange = generateDateRange();

  // Filter rooms based on filters
  const filteredRooms = rooms?.filter(room => {
    if (filters?.roomType !== 'all' && room?.type !== filters?.roomType) return false;
    if (filters?.status !== 'all' && room?.status !== filters?.status) return false;
    return true;
  });

  // Get bookings for a specific room and date
  const getBookingsForRoomAndDate = (roomId, date) => {
    const dateStr = date?.toISOString()?.split('T')?.[0];
    return bookings?.filter(booking => 
      booking?.roomId === roomId && 
      booking?.checkIn <= dateStr && 
      booking?.checkOut > dateStr
    );
  };

  const handleCellClick = (roomId, date) => {
    const roomBookings = getBookingsForRoomAndDate(roomId, date);
    if (roomBookings?.length === 0) {
      setSelectedCell({ roomId, date });
      setShowQuickBooking(true);
    }
  };

  const handleQuickBookingClose = () => {
    setShowQuickBooking(false);
    setSelectedCell(null);
  };

  const handleQuickBookingSubmit = (bookingData) => {
    onBookingCreate({
      ...bookingData,
      roomId: selectedCell?.roomId,
      checkIn: selectedCell?.date?.toISOString()?.split('T')?.[0]
    });
    handleQuickBookingClose();
  };

  const getRoomStatusColor = (status) => {
    const statusColors = {
      available: 'bg-success/10 text-success',
      occupied: 'bg-error/10 text-error',
      maintenance: 'bg-warning/10 text-warning',
      blocked: 'bg-muted text-muted-foreground'
    };
    return statusColors?.[status] || 'bg-muted text-muted-foreground';
  };

  const formatDateHeader = (date) => {
    if (viewMode === 'daily') {
      return date?.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    } else if (viewMode === 'weekly') {
      return date?.toLocaleDateString('en-US', { 
        weekday: 'short', 
        day: 'numeric' 
      });
    }
    return date?.getDate()?.toString();
  };

  return (
    <>
      <div className="flex-1 overflow-auto bg-background">
        <div className="min-w-full">
          {/* Calendar Header Row */}
          <div className="sticky top-0 z-10 bg-card border-b border-border">
            <div className="flex">
              {/* Room Column Header */}
              <div className="w-48 flex-shrink-0 p-4 border-r border-border bg-muted/50">
                <h3 className="text-sm font-semibold text-foreground">Rooms</h3>
              </div>
              
              {/* Date Headers */}
              <div className="flex flex-1 min-w-0">
                {dateRange?.map((date, index) => (
                  <div 
                    key={index}
                    className="flex-1 min-w-32 p-4 border-r border-border text-center bg-muted/50"
                  >
                    <div className="text-sm font-medium text-foreground">
                      {formatDateHeader(date)}
                    </div>
                    {viewMode !== 'monthly' && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {date?.toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Calendar Body */}
          <div className="divide-y divide-border">
            {filteredRooms?.map((room) => (
              <div key={room?.id} className="flex hover:bg-muted/30 transition-colors">
                {/* Room Info Column */}
                <div className="w-48 flex-shrink-0 p-4 border-r border-border bg-card">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">
                        Room {room?.number}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoomStatusColor(room?.status)}`}>
                        {room?.status}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {room?.type} • Floor {room?.floor}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ${room?.baseRate}/night
                    </div>
                  </div>
                </div>

                {/* Date Cells */}
                <div className="flex flex-1 min-w-0">
                  {dateRange?.map((date, dateIndex) => {
                    const cellBookings = getBookingsForRoomAndDate(room?.id, date);
                    const isToday = date?.toDateString() === new Date()?.toDateString();
                    
                    return (
                      <div 
                        key={dateIndex}
                        className={`
                          flex-1 min-w-32 min-h-20 p-2 border-r border-border cursor-pointer
                          hover:bg-accent/5 transition-colors relative
                          ${isToday ? 'bg-accent/10' : 'bg-card'}
                        `}
                        onClick={() => handleCellClick(room?.id, date)}
                      >
                        {/* Today Indicator */}
                        {isToday && (
                          <div className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
                        )}
                        {/* Booking Blocks */}
                        <div className="space-y-1">
                          {cellBookings?.map((booking) => (
                            <BookingBlock
                              key={booking?.id}
                              booking={booking}
                              onUpdate={onBookingUpdate}
                              compact={viewMode === 'monthly'}
                            />
                          ))}
                        </div>
                        {/* Empty Cell Indicator */}
                        {cellBookings?.length === 0 && room?.status === 'available' && (
                          <div className="flex items-center justify-center h-full opacity-0 hover:opacity-100 transition-opacity">
                            <Icon name="Plus" size={16} className="text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Quick Booking Modal */}
      {showQuickBooking && selectedCell && (
        <QuickBookingModal
          isOpen={showQuickBooking}
          onClose={handleQuickBookingClose}
          onSubmit={handleQuickBookingSubmit}
          selectedRoom={filteredRooms?.find(r => r?.id === selectedCell?.roomId)}
          selectedDate={selectedCell?.date}
        />
      )}
    </>
  );
};

export default CalendarGrid;