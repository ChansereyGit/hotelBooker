package com.hotelbooker.booking.repository;

import com.hotelbooker.booking.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, String> {
    
    List<Booking> findByUserIdOrderByCreatedAtDesc(String userId);
    
    List<Booking> findByUserIdAndStatusOrderByCheckInDateDesc(String userId, Booking.BookingStatus status);
    
    List<Booking> findByUserIdAndCheckInDateAfterOrderByCheckInDate(String userId, LocalDate date);
    
    List<Booking> findByUserIdAndCheckOutDateBeforeOrderByCheckOutDateDesc(String userId, LocalDate date);
}
