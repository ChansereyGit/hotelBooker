package com.hotelbooker.hotel.controller;

import com.hotelbooker.common.dto.ApiResponse;
import com.hotelbooker.hotel.dto.HotelDto;
import com.hotelbooker.hotel.dto.HotelSearchRequest;
import com.hotelbooker.hotel.dto.RoomDto;
import com.hotelbooker.hotel.service.HotelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/hotels")
@RequiredArgsConstructor
public class HotelController {
    
    private final HotelService hotelService;
    
    @PostMapping("/search")
    public ResponseEntity<ApiResponse<List<HotelDto>>> searchHotels(
            @RequestBody HotelSearchRequest request
    ) {
        List<HotelDto> hotels = hotelService.searchHotels(request);
        return ResponseEntity.ok(ApiResponse.success(hotels));
    }
    
    @GetMapping("/{hotelId}")
    public ResponseEntity<ApiResponse<HotelDto>> getHotelById(
            @PathVariable String hotelId
    ) {
        HotelDto hotel = hotelService.getHotelById(hotelId);
        return ResponseEntity.ok(ApiResponse.success(hotel));
    }
    
    @GetMapping("/{hotelId}/rooms")
    public ResponseEntity<ApiResponse<List<RoomDto>>> getHotelRooms(
            @PathVariable String hotelId
    ) {
        List<RoomDto> rooms = hotelService.getHotelRooms(hotelId);
        return ResponseEntity.ok(ApiResponse.success(rooms));
    }
    
    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<HotelDto>>> getFeaturedHotels() {
        List<HotelDto> hotels = hotelService.getFeaturedHotels();
        return ResponseEntity.ok(ApiResponse.success(hotels));
    }
    
    @GetMapping("/destinations")
    public ResponseEntity<ApiResponse<List<String>>> getPopularDestinations() {
        List<String> destinations = hotelService.getPopularDestinations();
        return ResponseEntity.ok(ApiResponse.success(destinations));
    }
}
