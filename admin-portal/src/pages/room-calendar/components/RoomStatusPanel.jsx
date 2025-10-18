import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const RoomStatusPanel = ({ rooms, onRoomStatusUpdate, onBulkUpdate }) => {
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [bulkAction, setBulkAction] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const statusOptions = [
    { value: '', label: 'Select Action' },
    { value: 'available', label: 'Mark Available' },
    { value: 'maintenance', label: 'Mark Maintenance' },
    { value: 'blocked', label: 'Block Rooms' },
    { value: 'clean', label: 'Mark Clean' }
  ];

  const getRoomStatusStats = () => {
    const stats = {
      available: 0,
      occupied: 0,
      maintenance: 0,
      blocked: 0,
      total: rooms?.length
    };

    rooms?.forEach(room => {
      stats[room.status] = (stats?.[room?.status] || 0) + 1;
    });

    return stats;
  };

  const stats = getRoomStatusStats();

  const handleRoomSelect = (roomId) => {
    setSelectedRooms(prev => 
      prev?.includes(roomId) 
        ? prev?.filter(id => id !== roomId)
        : [...prev, roomId]
    );
  };

  const handleSelectAll = () => {
    if (selectedRooms?.length === rooms?.length) {
      setSelectedRooms([]);
    } else {
      setSelectedRooms(rooms?.map(room => room?.id));
    }
  };

  const handleBulkAction = () => {
    if (bulkAction && selectedRooms?.length > 0) {
      onBulkUpdate(selectedRooms, bulkAction);
      setSelectedRooms([]);
      setBulkAction('');
    }
  };

  const getStatusIcon = (status) => {
    const iconMap = {
      available: 'Home',
      occupied: 'User',
      maintenance: 'Wrench',
      blocked: 'Ban'
    };
    return iconMap?.[status] || 'Home';
  };

  const getStatusColor = (status) => {
    const colorMap = {
      available: 'text-success',
      occupied: 'text-error',
      maintenance: 'text-warning',
      blocked: 'text-muted-foreground'
    };
    return colorMap?.[status] || 'text-muted-foreground';
  };

  return (
    <div className="bg-card border-l border-border">
      {/* Toggle Button for Mobile */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="lg:hidden w-full p-4 text-left border-b border-border hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center justify-between">
          <span className="font-medium text-foreground">Room Status Panel</span>
          <Icon 
            name={isExpanded ? 'ChevronUp' : 'ChevronDown'} 
            size={20} 
            className="text-muted-foreground"
          />
        </div>
      </button>
      {/* Panel Content */}
      <div className={`${isExpanded ? 'block' : 'hidden'} lg:block`}>
        {/* Status Overview */}
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground mb-3">Room Status Overview</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-success/10 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Icon name="Home" size={16} className="text-success" />
                <span className="text-sm font-medium text-success">Available</span>
              </div>
              <div className="text-lg font-bold text-success mt-1">{stats?.available}</div>
            </div>
            
            <div className="bg-error/10 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Icon name="User" size={16} className="text-error" />
                <span className="text-sm font-medium text-error">Occupied</span>
              </div>
              <div className="text-lg font-bold text-error mt-1">{stats?.occupied}</div>
            </div>
            
            <div className="bg-warning/10 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Icon name="Wrench" size={16} className="text-warning" />
                <span className="text-sm font-medium text-warning">Maintenance</span>
              </div>
              <div className="text-lg font-bold text-warning mt-1">{stats?.maintenance}</div>
            </div>
            
            <div className="bg-muted rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Icon name="Ban" size={16} className="text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Blocked</span>
              </div>
              <div className="text-lg font-bold text-muted-foreground mt-1">{stats?.blocked}</div>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground mb-3">Bulk Actions</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {selectedRooms?.length} room{selectedRooms?.length !== 1 ? 's' : ''} selected
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSelectAll}
              >
                {selectedRooms?.length === rooms?.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>

            <Select
              options={statusOptions}
              value={bulkAction}
              onChange={setBulkAction}
              placeholder="Choose action"
              disabled={selectedRooms?.length === 0}
            />

            <Button
              variant="default"
              size="sm"
              fullWidth
              disabled={!bulkAction || selectedRooms?.length === 0}
              onClick={handleBulkAction}
              iconName="Settings"
              iconPosition="left"
            >
              Apply to Selected
            </Button>
          </div>
        </div>

        {/* Room List */}
        <div className="p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">All Rooms</h3>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {rooms?.map((room) => (
              <div
                key={room?.id}
                className={`
                  flex items-center space-x-3 p-2 rounded-md cursor-pointer transition-colors
                  ${selectedRooms?.includes(room?.id) 
                    ? 'bg-accent/10 border border-accent' :'hover:bg-muted/50'
                  }
                `}
                onClick={() => handleRoomSelect(room?.id)}
              >
                <div className={`
                  w-4 h-4 rounded border-2 flex items-center justify-center
                  ${selectedRooms?.includes(room?.id) 
                    ? 'bg-accent border-accent' :'border-muted-foreground'
                  }
                `}>
                  {selectedRooms?.includes(room?.id) && (
                    <Icon name="Check" size={10} className="text-accent-foreground" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm text-foreground">
                      Room {room?.number}
                    </span>
                    <Icon 
                      name={getStatusIcon(room?.status)} 
                      size={14} 
                      className={getStatusColor(room?.status)}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {room?.type} • Floor {room?.floor}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomStatusPanel;