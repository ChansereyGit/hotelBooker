package com.hotelbooker.booking.service;

import com.hotelbooker.auth.entity.User;
import com.hotelbooker.auth.repository.UserRepository;
import com.hotelbooker.booking.dto.BookingDto;
import com.hotelbooker.booking.dto.CreateBookingRequest;
import com.hotelbooker.booking.entity.Booking;
import com.hotelbooker.booking.repository.BookingRepository;
import com.hotelbooker.common.exception.ResourceNotFoundException;
import com.hotelbooker.hotel.entity.Hotel;
import com.hotelbooker.hotel.entity.Room;
import com.hotelbooker.hotel.repository.HotelRepository;
import com.hotelbooker.hotel.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {
    
    private final BookingRepository bookingRepository;
    private final HotelRepository hotelRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    
    @Transactional
    public BookingDto createBooking(CreateBookingRequest request) {
        User user = getCurrentUser();
        
        Hotel hotel = hotelRepository.findById(request.getHotelId())
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found"));
        
        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));
        
        // Validate dates
        if (request.getCheckOutDate().isBefore(request.getCheckInDate())) {
            throw new RuntimeException("Check-out date must be after check-in date");
        }
        
        // Check room availability
        if (room.getAvailableRooms() < request.getNumberOfRooms()) {
            throw new RuntimeException("Not enough rooms available");
        }
        
        // Calculate nights and total price
        long nights = ChronoUnit.DAYS.between(request.getCheckInDate(), request.getCheckOutDate());
        double totalPrice = room.getPricePerNight() * nights * request.getNumberOfRooms();
        
        Booking booking = Booking.builder()
                .user(user)
                .hotel(hotel)
                .room(room)
                .checkInDate(request.getCheckInDate())
                .checkOutDate(request.getCheckOutDate())
                .numberOfGuests(request.getNumberOfGuests())
                .numberOfRooms(request.getNumberOfRooms())
                .numberOfNights((int) nights)
                .totalPrice(totalPrice)
                .status(Booking.BookingStatus.PENDING)
                .specialRequests(request.getSpecialRequests())
                .guestName(request.getGuestName())
                .guestEmail(request.getGuestEmail())
                .guestPhone(request.getGuestPhone())
                .build();
        
        // Update room availability
        room.setAvailableRooms(room.getAvailableRooms() - request.getNumberOfRooms());
        roomRepository.save(room);
        
        booking = bookingRepository.save(booking);
        return mapToDto(booking);
    }
    
    public List<BookingDto> getUserBookings() {
        User user = getCurrentUser();
        return bookingRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    public BookingDto getBookingById(String bookingId) {
        User user = getCurrentUser();
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        
        if (!booking.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to booking");
        }
        
        return mapToDto(booking);
    }
    
    public List<BookingDto> getUpcomingBookings() {
        User user = getCurrentUser();
        return bookingRepository.findByUserIdAndCheckInDateAfterOrderByCheckInDate(
                        user.getId(), LocalDate.now())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public BookingDto cancelBooking(String bookingId) {
        User user = getCurrentUser();
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        
        if (!booking.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to booking");
        }
        
        if (booking.getStatus() == Booking.BookingStatus.CANCELLED) {
            throw new RuntimeException("Booking is already cancelled");
        }
        
        booking.setStatus(Booking.BookingStatus.CANCELLED);
        
        // Restore room availability
        Room room = booking.getRoom();
        room.setAvailableRooms(room.getAvailableRooms() + booking.getNumberOfRooms());
        roomRepository.save(room);
        
        booking = bookingRepository.save(booking);
        return mapToDto(booking);
    }
    
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
    
    private BookingDto mapToDto(Booking booking) {
        return BookingDto.builder()
                .id(booking.getId())
                .userId(booking.getUser().getId())
                .hotelId(booking.getHotel().getId())
                .hotelName(booking.getHotel().getName())
                .roomId(booking.getRoom().getId())
                .roomType(booking.getRoom().getRoomType())
                .checkInDate(booking.getCheckInDate())
                .checkOutDate(booking.getCheckOutDate())
                .numberOfGuests(booking.getNumberOfGuests())
                .numberOfRooms(booking.getNumberOfRooms())
                .numberOfNights(booking.getNumberOfNights())
                .totalPrice(booking.getTotalPrice())
                .status(booking.getStatus().name())
                .specialRequests(booking.getSpecialRequests())
                .guestName(booking.getGuestName())
                .guestEmail(booking.getGuestEmail())
                .guestPhone(booking.getGuestPhone())
                .build();
    }
}
