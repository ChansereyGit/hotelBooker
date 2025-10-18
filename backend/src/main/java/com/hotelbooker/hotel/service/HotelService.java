package com.hotelbooker.hotel.service;

import com.hotelbooker.common.exception.ResourceNotFoundException;
import com.hotelbooker.hotel.dto.HotelDto;
import com.hotelbooker.hotel.dto.HotelSearchRequest;
import com.hotelbooker.hotel.dto.RoomDto;
import com.hotelbooker.hotel.entity.Hotel;
import com.hotelbooker.hotel.entity.Room;
import com.hotelbooker.hotel.repository.HotelRepository;
import com.hotelbooker.hotel.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HotelService {
    
    private final HotelRepository hotelRepository;
    private final RoomRepository roomRepository;
    
    public List<HotelDto> searchHotels(HotelSearchRequest request) {
        List<Hotel> hotels;
        
        if (request.getLocation() != null && !request.getLocation().isEmpty()) {
            hotels = hotelRepository.searchByLocation(request.getLocation());
        } else {
            hotels = hotelRepository.findAll();
        }
        
        // Apply filters
        return hotels.stream()
                .filter(h -> request.getMinPrice() == null || h.getPricePerNight() >= request.getMinPrice())
                .filter(h -> request.getMaxPrice() == null || h.getPricePerNight() <= request.getMaxPrice())
                .filter(h -> request.getMinStarRating() == null || h.getStarRating() >= request.getMinStarRating())
                .filter(h -> request.getMinGuestRating() == null || h.getGuestRating() >= request.getMinGuestRating())
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    public HotelDto getHotelById(String hotelId) {
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + hotelId));
        return mapToDto(hotel);
    }
    
    public List<RoomDto> getHotelRooms(String hotelId) {
        if (!hotelRepository.existsById(hotelId)) {
            throw new ResourceNotFoundException("Hotel not found with id: " + hotelId);
        }
        
        List<Room> rooms = roomRepository.findByHotelIdAndAvailableRoomsGreaterThan(hotelId, 0);
        return rooms.stream()
                .map(this::mapToRoomDto)
                .collect(Collectors.toList());
    }
    
    public List<HotelDto> getFeaturedHotels() {
        return hotelRepository.findByFeaturedTrueAndAvailableTrue()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    public List<String> getPopularDestinations() {
        return hotelRepository.findAllCities();
    }
    
    private HotelDto mapToDto(Hotel hotel) {
        return HotelDto.builder()
                .id(hotel.getId())
                .name(hotel.getName())
                .description(hotel.getDescription())
                .address(hotel.getAddress())
                .city(hotel.getCity())
                .country(hotel.getCountry())
                .latitude(hotel.getLatitude())
                .longitude(hotel.getLongitude())
                .pricePerNight(hotel.getPricePerNight())
                .guestRating(hotel.getGuestRating())
                .totalReviews(hotel.getTotalReviews())
                .starRating(hotel.getStarRating())
                .images(hotel.getImages())
                .amenities(hotel.getAmenities())
                .featured(hotel.isFeatured())
                .available(hotel.isAvailable())
                .build();
    }
    
    private RoomDto mapToRoomDto(Room room) {
        return RoomDto.builder()
                .id(room.getId())
                .hotelId(room.getHotel().getId())
                .roomType(room.getRoomType())
                .description(room.getDescription())
                .pricePerNight(room.getPricePerNight())
                .maxGuests(room.getMaxGuests())
                .totalRooms(room.getTotalRooms())
                .availableRooms(room.getAvailableRooms())
                .size(room.getSize())
                .images(room.getImages())
                .amenities(room.getAmenities())
                .bedType(room.getBedType())
                .hasBreakfast(room.isHasBreakfast())
                .freeCancellation(room.isFreeCancellation())
                .build();
    }
}
