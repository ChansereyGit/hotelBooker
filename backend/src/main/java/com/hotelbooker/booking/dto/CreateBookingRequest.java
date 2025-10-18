package com.hotelbooker.booking.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateBookingRequest {
    
    @NotBlank(message = "Hotel ID is required")
    private String hotelId;
    
    @NotBlank(message = "Room ID is required")
    private String roomId;
    
    @NotNull(message = "Check-in date is required")
    @Future(message = "Check-in date must be in the future")
    private LocalDate checkInDate;
    
    @NotNull(message = "Check-out date is required")
    @Future(message = "Check-out date must be in the future")
    private LocalDate checkOutDate;
    
    @NotNull(message = "Number of guests is required")
    @Min(value = 1, message = "At least 1 guest is required")
    private Integer numberOfGuests;
    
    @NotNull(message = "Number of rooms is required")
    @Min(value = 1, message = "At least 1 room is required")
    private Integer numberOfRooms;
    
    private String specialRequests;
    
    @NotBlank(message = "Guest name is required")
    private String guestName;
    
    @NotBlank(message = "Guest email is required")
    @Email(message = "Invalid email format")
    private String guestEmail;
    
    @NotBlank(message = "Guest phone is required")
    private String guestPhone;
}
