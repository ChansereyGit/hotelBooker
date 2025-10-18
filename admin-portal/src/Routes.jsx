import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import LoginPage from './pages/login';
import BookingManagement from './pages/booking-management';
import Dashboard from './pages/dashboard';
import PropertyManagement from './pages/property-management';
import StaffManagement from './pages/staff-management';
import RoomCalendar from './pages/room-calendar';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/booking-management" element={<BookingManagement />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/property-management" element={<PropertyManagement />} />
        <Route path="/staff-management" element={<StaffManagement />} />
        <Route path="/room-calendar" element={<RoomCalendar />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
