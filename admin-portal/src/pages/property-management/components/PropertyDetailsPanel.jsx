import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import GeneralInfoTab from './GeneralInfoTab';
import RoomTypesTab from './RoomTypesTab';
import AmenitiesTab from './AmenitiesTab';
import PhotosTab from './PhotosTab';
import PricingRulesTab from './PricingRulesTab';

const PropertyDetailsPanel = ({ 
  property, 
  onUpdateProperty, 
  onDeleteProperty,
  isEditing,
  onToggleEdit 
}) => {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General Info', icon: 'Info' },
    { id: 'rooms', label: 'Room Types', icon: 'Bed' },
    { id: 'amenities', label: 'Amenities', icon: 'Wifi' },
    { id: 'photos', label: 'Photos', icon: 'Camera' },
    { id: 'pricing', label: 'Pricing Rules', icon: 'DollarSign' }
  ];

  if (!property) {
    return (
      <div className="flex-1 bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="Building2" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            Select a Property
          </h3>
          <p className="text-muted-foreground">
            Choose a property from the list to view and edit details
          </p>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <GeneralInfoTab 
            property={property} 
            onUpdate={onUpdateProperty}
            isEditing={isEditing}
          />
        );
      case 'rooms':
        return (
          <RoomTypesTab 
            property={property} 
            onUpdate={onUpdateProperty}
            isEditing={isEditing}
          />
        );
      case 'amenities':
        return (
          <AmenitiesTab 
            property={property} 
            onUpdate={onUpdateProperty}
            isEditing={isEditing}
          />
        );
      case 'photos':
        return (
          <PhotosTab 
            property={property} 
            onUpdate={onUpdateProperty}
            isEditing={isEditing}
          />
        );
      case 'pricing':
        return (
          <PricingRulesTab 
            property={property} 
            onUpdate={onUpdateProperty}
            isEditing={isEditing}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Building2" size={20} color="white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                {property?.name}
              </h1>
              <p className="text-sm text-muted-foreground">
                {property?.location}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant={isEditing ? "secondary" : "outline"}
              iconName={isEditing ? "X" : "Edit"}
              iconPosition="left"
              onClick={onToggleEdit}
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>
            
            {isEditing && (
              <Button
                variant="default"
                iconName="Save"
                iconPosition="left"
                onClick={() => {
                  // Save logic would be handled by parent
                  onToggleEdit();
                }}
              >
                Save Changes
              </Button>
            )}

            <Button
              variant="destructive"
              iconName="Trash2"
              iconPosition="left"
              onClick={() => onDeleteProperty(property?.id)}
            >
              Delete
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mt-4 border-b border-border">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`
                flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-t-md transition-colors
                ${activeTab === tab?.id
                  ? 'text-primary border-b-2 border-primary bg-primary/5' :'text-muted-foreground hover:text-foreground hover:bg-muted'
                }
              `}
            >
              <Icon name={tab?.icon} size={16} />
              <span>{tab?.label}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default PropertyDetailsPanel;