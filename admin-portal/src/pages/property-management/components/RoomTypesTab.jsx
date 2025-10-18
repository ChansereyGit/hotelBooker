import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const RoomTypesTab = ({ property, onUpdate, isEditing }) => {
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const mockRoomTypes = [
    {
      id: 1,
      name: 'Standard Single',
      description: 'Comfortable single room with modern amenities',
      maxOccupancy: 1,
      bedType: 'Single',
      size: 250,
      basePrice: 89.99,
      totalRooms: 15,
      availableRooms: 12,
      amenities: ['WiFi', 'AC', 'TV', 'Mini Fridge']
    },
    {
      id: 2,
      name: 'Deluxe Double',
      description: 'Spacious double room with city view',
      maxOccupancy: 2,
      bedType: 'Queen',
      size: 350,
      basePrice: 129.99,
      totalRooms: 20,
      availableRooms: 18,
      amenities: ['WiFi', 'AC', 'TV', 'Mini Fridge', 'City View', 'Work Desk']
    },
    {
      id: 3,
      name: 'Executive Suite',
      description: 'Luxury suite with separate living area and premium amenities',
      maxOccupancy: 4,
      bedType: 'King',
      size: 600,
      basePrice: 249.99,
      totalRooms: 8,
      availableRooms: 6,
      amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Ocean View', 'Balcony', 'Living Area', 'Premium Bathroom']
    }
  ];

  const bedTypeOptions = [
    { value: 'Single', label: 'Single Bed' },
    { value: 'Twin', label: 'Twin Beds' },
    { value: 'Double', label: 'Double Bed' },
    { value: 'Queen', label: 'Queen Bed' },
    { value: 'King', label: 'King Bed' },
    { value: 'Sofa Bed', label: 'Sofa Bed' }
  ];

  const RoomTypeCard = ({ roomType }) => (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-elevation-2 transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-medium text-foreground mb-1">{roomType?.name}</h4>
          <p className="text-sm text-muted-foreground mb-2">{roomType?.description}</p>
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <span className="flex items-center">
              <Icon name="Users" size={12} className="mr-1" />
              Max {roomType?.maxOccupancy}
            </span>
            <span className="flex items-center">
              <Icon name="Bed" size={12} className="mr-1" />
              {roomType?.bedType}
            </span>
            <span className="flex items-center">
              <Icon name="Square" size={12} className="mr-1" />
              {roomType?.size} sq ft
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold text-foreground">
            ${roomType?.basePrice}
          </div>
          <div className="text-xs text-muted-foreground">per night</div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-4 text-sm">
          <span className="text-muted-foreground">
            Total: <span className="font-medium text-foreground">{roomType?.totalRooms}</span>
          </span>
          <span className="text-muted-foreground">
            Available: <span className="font-medium text-success">{roomType?.availableRooms}</span>
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="sm"
            iconName="Edit"
            onClick={() => setSelectedRoomType(roomType)}
            disabled={!isEditing}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            iconName="Trash2"
            disabled={!isEditing}
          >
            Delete
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-1">
        {roomType?.amenities?.slice(0, 4)?.map((amenity, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full"
          >
            {amenity}
          </span>
        ))}
        {roomType?.amenities?.length > 4 && (
          <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
            +{roomType?.amenities?.length - 4} more
          </span>
        )}
      </div>
    </div>
  );

  const AddRoomTypeForm = () => (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-foreground">Add New Room Type</h4>
        <Button
          variant="ghost"
          size="sm"
          iconName="X"
          onClick={() => setShowAddForm(false)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Room Type Name"
          type="text"
          placeholder="e.g., Deluxe Suite"
          required
        />

        <Select
          label="Bed Type"
          options={bedTypeOptions}
          placeholder="Select bed type"
          required
        />

        <Input
          label="Max Occupancy"
          type="number"
          placeholder="2"
          min="1"
          max="10"
          required
        />

        <Input
          label="Room Size (sq ft)"
          type="number"
          placeholder="350"
          required
        />

        <Input
          label="Base Price (USD)"
          type="number"
          placeholder="129.99"
          step="0.01"
          required
        />

        <Input
          label="Total Rooms"
          type="number"
          placeholder="20"
          min="1"
          required
        />

        <div className="md:col-span-2">
          <Input
            label="Description"
            type="text"
            placeholder="Brief description of the room type"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 mt-6">
        <Button
          variant="outline"
          onClick={() => setShowAddForm(false)}
        >
          Cancel
        </Button>
        <Button
          variant="default"
          iconName="Plus"
          iconPosition="left"
        >
          Add Room Type
        </Button>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-medium text-foreground flex items-center">
              <Icon name="Bed" size={20} className="mr-2" />
              Room Types & Inventory
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Manage room types, pricing, and inventory for {property?.name}
            </p>
          </div>

          {isEditing && (
            <Button
              variant="default"
              iconName="Plus"
              iconPosition="left"
              onClick={() => setShowAddForm(true)}
            >
              Add Room Type
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {showAddForm && <AddRoomTypeForm />}
          
          {mockRoomTypes?.map((roomType) => (
            <RoomTypeCard key={roomType?.id} roomType={roomType} />
          ))}
        </div>

        {mockRoomTypes?.length === 0 && (
          <div className="text-center py-12">
            <Icon name="Bed" size={48} className="mx-auto text-muted-foreground mb-4" />
            <h4 className="text-lg font-medium text-foreground mb-2">
              No Room Types Yet
            </h4>
            <p className="text-muted-foreground mb-4">
              Add your first room type to start managing inventory
            </p>
            {isEditing && (
              <Button
                variant="default"
                iconName="Plus"
                iconPosition="left"
                onClick={() => setShowAddForm(true)}
              >
                Add Room Type
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomTypesTab;