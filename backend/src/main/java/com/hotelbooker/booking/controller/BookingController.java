package com.hotelbooker.booking.controller;

import com.hotelbooker.booking.dto.BookingDto;
import com.hotelbooker.booking.dto.CreateBookingRequest;
import com.hotelbooker.booking.service.BookingService;
import com.hotelbooker.common.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
public class BookingController {
    
    private final BookingService bookingService;
    
    @PostMapping
    public ResponseEntity<ApiResponse<BookingDto>> createBooking(
            @Valid @RequestBody CreateBookingRequest request
    ) {
        BookingDto booking = bookingService.createBooking(request);
        return ResponseEntity.ok(ApiResponse.success("Booking created successfully", booking));
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<BookingDto>>> getUserBookings() {
        List<BookingDto> bookings = bookingService.getUserBookings();
        return ResponseEntity.ok(ApiResponse.success(bookings));
    }
    
    @GetMapping("/{bookingId}")
    public ResponseEntity<ApiResponse<BookingDto>> getBookingById(
            @PathVariable String bookingId
    ) {
        BookingDto booking = bookingService.getBookingById(bookingId);
        return ResponseEntity.ok(ApiResponse.success(booking));
    }
    
    @GetMapping("/upcoming")
    public ResponseEntity<ApiResponse<List<BookingDto>>> getUpcomingBookings() {
        List<BookingDto> bookings = bookingService.getUpcomingBookings();
        return ResponseEntity.ok(ApiResponse.success(bookings));
    }
    
    @PostMapping("/{bookingId}/cancel")
    public ResponseEntity<ApiResponse<BookingDto>> cancelBooking(
            @PathVariable String bookingId
    ) {
        BookingDto booking = bookingService.cancelBooking(bookingId);
        return ResponseEntity.ok(ApiResponse.success("Booking cancelled successfully", booking));
    }
}
