import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const CreatePropertyModal = ({ isOpen, onClose, onCreateProperty }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    phone: '',
    email: '',
    website: '',
    rating: '3',
    checkInTime: '15:00',
    checkOutTime: '11:00',
    currency: 'USD'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const countryOptions = [
    { value: 'US', label: 'United States' },
    { value: 'CA', label: 'Canada' },
    { value: 'GB', label: 'United Kingdom' },
    { value: 'AU', label: 'Australia' },
    { value: 'DE', label: 'Germany' },
    { value: 'FR', label: 'France' },
    { value: 'IT', label: 'Italy' },
    { value: 'ES', label: 'Spain' }
  ];

  const ratingOptions = [
    { value: '1', label: '1 Star' },
    { value: '2', label: '2 Stars' },
    { value: '3', label: '3 Stars' },
    { value: '4', label: '4 Stars' },
    { value: '5', label: '5 Stars' }
  ];

  const currencyOptions = [
    { value: 'USD', label: 'US Dollar (USD)' },
    { value: 'EUR', label: 'Euro (EUR)' },
    { value: 'GBP', label: 'British Pound (GBP)' },
    { value: 'CAD', label: 'Canadian Dollar (CAD)' },
    { value: 'AUD', label: 'Australian Dollar (AUD)' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.name?.trim()) newErrors.name = 'Property name is required';
    if (!formData?.address?.trim()) newErrors.address = 'Address is required';
    if (!formData?.city?.trim()) newErrors.city = 'City is required';
    if (!formData?.state?.trim()) newErrors.state = 'State/Province is required';
    if (!formData?.zipCode?.trim()) newErrors.zipCode = 'ZIP/Postal code is required';
    if (!formData?.phone?.trim()) newErrors.phone = 'Phone number is required';
    if (!formData?.email?.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/?.test(formData?.email)) newErrors.email = 'Invalid email format';

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newProperty = {
        id: Date.now(),
        ...formData,
        rating: parseInt(formData?.rating),
        status: 'active',
        totalRooms: 0,
        location: `${formData?.city}, ${formData?.state}`,
        createdAt: new Date()?.toISOString()
      };

      onCreateProperty(newProperty);
      onClose();
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'US',
        phone: '',
        email: '',
        website: '',
        rating: '3',
        checkInTime: '15:00',
        checkOutTime: '11:00',
        currency: 'USD'
      });
    } catch (error) {
      console.error('Error creating property:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-300 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Building2" size={20} color="white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Create New Property</h2>
              <p className="text-sm text-muted-foreground">Add a new hotel property to your portfolio</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={onClose}
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground flex items-center">
                <Icon name="Info" size={20} className="mr-2" />
                Basic Information
              </h3>

              <Input
                label="Property Name"
                type="text"
                value={formData?.name}
                onChange={(e) => handleInputChange('name', e?.target?.value)}
                error={errors?.name}
                required
                placeholder="e.g., Grand Plaza Hotel"
              />

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Description</label>
                <textarea
                  value={formData?.description}
                  onChange={(e) => handleInputChange('description', e?.target?.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-md text-sm"
                  placeholder="Brief description of your property..."
                />
              </div>

              <Select
                label="Star Rating"
                options={ratingOptions}
                value={formData?.rating}
                onChange={(value) => handleInputChange('rating', value)}
                required
              />

              <Select
                label="Currency"
                options={currencyOptions}
                value={formData?.currency}
                onChange={(value) => handleInputChange('currency', value)}
                required
              />
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground flex items-center">
                <Icon name="MapPin" size={20} className="mr-2" />
                Address Information
              </h3>

              <Input
                label="Street Address"
                type="text"
                value={formData?.address}
                onChange={(e) => handleInputChange('address', e?.target?.value)}
                error={errors?.address}
                required
                placeholder="123 Main Street"
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="City"
                  type="text"
                  value={formData?.city}
                  onChange={(e) => handleInputChange('city', e?.target?.value)}
                  error={errors?.city}
                  required
                  placeholder="New York"
                />

                <Input
                  label="State/Province"
                  type="text"
                  value={formData?.state}
                  onChange={(e) => handleInputChange('state', e?.target?.value)}
                  error={errors?.state}
                  required
                  placeholder="NY"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="ZIP/Postal Code"
                  type="text"
                  value={formData?.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e?.target?.value)}
                  error={errors?.zipCode}
                  required
                  placeholder="10001"
                />

                <Select
                  label="Country"
                  options={countryOptions}
                  value={formData?.country}
                  onChange={(value) => handleInputChange('country', value)}
                  required
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground flex items-center">
                <Icon name="Phone" size={20} className="mr-2" />
                Contact Information
              </h3>

              <Input
                label="Phone Number"
                type="tel"
                value={formData?.phone}
                onChange={(e) => handleInputChange('phone', e?.target?.value)}
                error={errors?.phone}
                required
                placeholder="+1 (555) 123-4567"
              />

              <Input
                label="Email Address"
                type="email"
                value={formData?.email}
                onChange={(e) => handleInputChange('email', e?.target?.value)}
                error={errors?.email}
                required
                placeholder="info@grandplaza.com"
              />

              <Input
                label="Website URL"
                type="url"
                value={formData?.website}
                onChange={(e) => handleInputChange('website', e?.target?.value)}
                placeholder="https://www.grandplaza.com"
              />
            </div>

            {/* Operational Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground flex items-center">
                <Icon name="Clock" size={20} className="mr-2" />
                Operational Settings
              </h3>

              <Input
                label="Check-in Time"
                type="time"
                value={formData?.checkInTime}
                onChange={(e) => handleInputChange('checkInTime', e?.target?.value)}
                required
              />

              <Input
                label="Check-out Time"
                type="time"
                value={formData?.checkOutTime}
                onChange={(e) => handleInputChange('checkOutTime', e?.target?.value)}
                required
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            iconName="Plus"
            iconPosition="left"
            loading={isSubmitting}
            onClick={handleSubmit}
          >
            Create Property
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreatePropertyModal;