# ✅ Hotel Search Home - Complete Integration Guide

## 🎉 What's Been Created

Complete API integration for the Hotel Search Home screen with mock data!

---

## 📋 Files Created

### ✅ Backend:
1. **`backend/MOCK_DATA.sql`** - Mock hotel data (5 hotels with rooms)

### ✅ Flutter:
2. **`flutter/lib/models/hotel.dart`** - Hotel model
3. **`flutter/lib/services/hotel_service.dart`** - Hotel API service

---

## 🗄️ Step 1: Add Mock Data to Database

### Run the SQL Script:

```bash
# Option 1: Using psql
psql -U root -d hotelbooker -f backend/MOCK_DATA.sql

# Option 2: Using pgAdmin or DBeaver
# Open backend/MOCK_DATA.sql and execute it
```

### What Gets Created:
- ✅ 5 Hotels (New York, Los Angeles, Miami)
- ✅ 6 Room types
- ✅ Hotel images
- ✅ Hotel amenities
- ✅ Room amenities

---

## 🔌 Step 2: Backend Endpoints Available

### Already Implemented:
```
POST /api/v1/hotels/search       - Search hotels with filters
GET  /api/v1/hotels/featured     - Get featured hotels
GET  /api/v1/hotels/{id}         - Get hotel details
GET  /api/v1/hotels/{id}/rooms   - Get hotel rooms
GET  /api/v1/hotels/destinations - Get popular destinations
```

---

## 📱 Step 3: Update Flutter Screen

### Update `hotel_search_home.dart`:

Add these imports at the top:
```dart
import '../../services/hotel_service.dart';
import '../../models/hotel.dart';
```

Add service instance in the state class:
```dart
class _HotelSearchHomeState extends State<HotelSearchHome> {
  final HotelService _hotelService = HotelService();
  List<Hotel> _featuredHotels = [];
  List<String> _popularDestinations = [];
  bool _isLoading = false;
  
  // ... rest of your code
}
```

Add init method to load data:
```dart
@override
void initState() {
  super.initState();
  _loadFeaturedHotels();
  _loadPopularDestinations();
}

Future<void> _loadFeaturedHotels() async {
  setState(() => _isLoading = true);
  
  final result = await _hotelService.getFeaturedHotels();
  
  if (result['success']) {
    setState(() {
      _featuredHotels = result['hotels'];
      _isLoading = false;
    });
  } else {
    setState(() => _isLoading = false);
    // Show error message
  }
}

Future<void> _loadPopularDestinations() async {
  final result = await _hotelService.getPopularDestinations();
  
  if (result['success']) {
    setState(() {
      _popularDestinations = result['destinations'];
    });
  }
}
```

Update the search button handler:
```dart
void _handleSearchHotels() async {
  setState(() => _isLoading = true);
  
  final result = await _hotelService.searchHotels(
    checkInDate: _checkInDate.toIso8601String().split('T')[0],
    checkOutDate: _checkOutDate.toIso8601String().split('T')[0],
    guests: _adults + _children,
    rooms: _rooms,
  );
  
  setState(() => _isLoading = false);
  
  if (result['success']) {
    // Navigate to results with hotels
    Navigator.pushNamed(
      context,
      '/hotel-search-results',
      arguments: result['hotels'],
    );
  } else {
    // Show error
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(result['message'])),
    );
  }
}
```

---

## 🧪 Step 4: Test the Integration

### 1. Start Backend:
```bash
cd backend
mvn spring-boot:run
```

### 2. Add Mock Data:
```bash
psql -U root -d hotelbooker -f backend/MOCK_DATA.sql
```

### 3. Test with Postman:

**Get Featured Hotels:**
```
GET http://localhost:8080/api/v1/hotels/featured
```

**Search Hotels:**
```
POST http://localhost:8080/api/v1/hotels/search
Content-Type: application/json

{
  "location": "New York"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Grand Plaza Hotel New York",
      "description": "Luxury 5-star hotel...",
      "city": "New York",
      "pricePerNight": 250.0,
      "guestRating": 4.8,
      "starRating": 5,
      "images": ["https://..."],
      "amenities": ["Free WiFi", "Pool", "Gym"],
      "featured": true
    }
  ]
}
```

### 4. Run Flutter App:
```bash
cd flutter
flutter run
```

### 5. Test Features:
- ✅ See featured hotels load on screen
- ✅ Search for hotels by location
- ✅ Filter by dates and guests
- ✅ View popular destinations

---

## 🎨 Mock Data Details

### Hotels Created:

1. **Grand Plaza Hotel New York**
   - Price: $250/night
   - Rating: 4.8 ⭐
   - 5-star luxury hotel
   - Amenities: WiFi, Pool, Gym, Spa, Restaurant

2. **Times Square Boutique Hotel**
   - Price: $180/night
   - Rating: 4.5 ⭐
   - 4-star boutique hotel
   - Amenities: WiFi, Rooftop Bar, Gym

3. **Sunset Boulevard Resort (LA)**
   - Price: $200/night
   - Rating: 4.6 ⭐
   - 4-star resort
   - Amenities: WiFi, Pool, Parking

4. **Santa Monica Beach Hotel**
   - Price: $220/night
   - Rating: 4.7 ⭐
   - 4-star beachfront
   - Amenities: WiFi, Beach Access, Pool

5. **Miami Beach Oceanfront Resort**
   - Price: $280/night
   - Rating: 4.9 ⭐
   - 5-star luxury resort
   - Amenities: WiFi, Private Beach, Spa, Restaurants

---

## 🔧 Configuration

### Change API Base URL:

**For Android Emulator:**
```dart
// flutter/lib/services/api_service.dart
static const String baseUrl = 'http://10.0.2.2:8080/api/v1';
```

**For iOS Simulator:**
```dart
static const String baseUrl = 'http://localhost:8080/api/v1';
```

**For Real Device:**
```dart
static const String baseUrl = 'http://YOUR_COMPUTER_IP:8080/api/v1';
```

---

## 📱 Features to Implement

### Current Screen Features:
- ✅ Location search
- ✅ Date picker (check-in/check-out)
- ✅ Guest selector (rooms, adults, children)
- ✅ Search button
- ✅ Recent searches (local storage)
- ✅ Quick filters (Tonight, Weekend, etc.)
- ✅ Hotels near me
- ✅ Popular destinations

### API Integration Needed:
- [ ] Load featured hotels on init
- [ ] Search hotels with filters
- [ ] Get popular destinations
- [ ] Save recent searches locally
- [ ] Handle loading states
- [ ] Handle errors gracefully

---

## 🎯 Next Steps

### 1. Update the Screen (15 minutes)
Add the code snippets above to integrate with the API

### 2. Test Backend (5 minutes)
```bash
# Start backend
cd backend
mvn spring-boot:run

# Add mock data
psql -U root -d hotelbooker -f backend/MOCK_DATA.sql

# Test with Postman
GET http://localhost:8080/api/v1/hotels/featured
```

### 3. Test Flutter (5 minutes)
```bash
cd flutter
flutter run
```

### 4. Implement Search Results Screen
Next screen to integrate with API

---

## 🐛 Troubleshooting

### "No hotels found"
- ✅ Check mock data is inserted: `SELECT * FROM hotels;`
- ✅ Check backend is running
- ✅ Check API base URL in Flutter

### "Network error"
- ✅ Backend running on port 8080?
- ✅ Correct base URL for your device?
- ✅ Android emulator? Use `10.0.2.2` not `localhost`

### "Database error"
- ✅ Run mock data SQL script
- ✅ Check PostgreSQL is running
- ✅ Verify database name is `hotelbooker`

---

## 📚 API Documentation

### Search Hotels
```dart
final result = await hotelService.searchHotels(
  location: 'New York',
  checkInDate: '2025-10-20',
  checkOutDate: '2025-10-22',
  guests: 2,
  rooms: 1,
  minPrice: 100.0,
  maxPrice: 300.0,
  minStarRating: 4,
  minGuestRating: 4.0,
);
```

### Get Featured Hotels
```dart
final result = await hotelService.getFeaturedHotels();
if (result['success']) {
  List<Hotel> hotels = result['hotels'];
}
```

### Get Hotel Details
```dart
final result = await hotelService.getHotelById('hotel-id');
if (result['success']) {
  Hotel hotel = result['hotel'];
}
```

---

## ✅ Integration Checklist

- [x] Backend hotel endpoints implemented
- [x] Mock data SQL created
- [x] Flutter hotel model created
- [x] Flutter hotel service created
- [ ] Screen updated with API integration
- [ ] Mock data inserted into database
- [ ] Tested with backend
- [ ] Tested with Flutter app

---

## 🎉 You're Ready!

Everything is set up! Just:
1. Add mock data to database
2. Update the screen with API calls
3. Test it!

**See the code snippets above for exact implementation.** 🚀
