# 🎯 Complete Booking Flow Implementation Guide

## 📋 Overview

Complete end-to-end booking flow from hotel search to booking confirmation.

---

## 🔄 Booking Flow

```
1. Hotel Search Results
   ↓ (Tap hotel card)
2. Hotel Detail Screen
   ↓ (Tap "Book" button)
3. Room Selection Screen
   ↓ (Select room & tap "Continue")
4. Booking Checkout Screen
   ↓ (Fill details & tap "Confirm Booking")
5. Booking Confirmation
   ↓
6. View My Bookings
```

---

## ✅ What's Been Created

### **Models:**
1. ✅ `flutter/lib/models/room.dart` - Room model
2. ✅ `flutter/lib/models/booking.dart` - Booking model

### **Services:**
3. ✅ `flutter/lib/services/booking_service.dart` - Booking API service
   - Get hotel rooms
   - Create booking
   - Get user bookings
   - Cancel booking

---

## 🔌 Backend Endpoints Available

### Already Implemented:
```
GET  /api/v1/hotels/{id}/rooms     - Get available rooms
POST /api/v1/bookings              - Create booking
GET  /api/v1/bookings              - Get user bookings
POST /api/v1/bookings/{id}/cancel  - Cancel booking
```

---

## 📱 Screens to Update

### 1. Hotel Detail Screen
**File:** `flutter/lib/presentation/hotel_detail/hotel_detail.dart`

**Needs:**
- Load hotel details from navigation arguments
- Show hotel images, amenities, description
- "Book" button → Navigate to Room Selection

### 2. Room Selection Screen
**File:** `flutter/lib/presentation/room_selection/room_selection.dart`

**Needs:**
- Load rooms from API using `BookingService`
- Display room cards with:
  - Room type
  - Price per night
  - Max guests
  - Amenities
  - Bed type
- "Select Room" button → Navigate to Checkout

### 3. Booking Checkout Screen
**File:** `flutter/lib/presentation/booking_checkout/booking_checkout.dart`

**Needs:**
- Show booking summary
- Guest information form:
  - Full name
  - Email
  - Phone number
  - Special requests (optional)
- Calculate total price
- "Confirm Booking" button → Create booking via API

---

## 🎯 Implementation Steps

### Step 1: Update Hotel Search Results (Pass hotel ID)

In `hotel_search_results.dart`, update the hotel card tap handler:

```dart
HotelCardWidget(
  hotel: hotel,
  onTap: () {
    Navigator.pushNamed(
      context,
      '/hotel-detail',
      arguments: {
        'hotelId': hotel['id'],
        'hotel': _filteredHotels[index], // Pass full hotel data
        'checkInDate': _checkInDate,
        'checkOutDate': _checkOutDate,
        'guests': _guests,
        'rooms': _rooms,
      },
    );
  },
)
```

### Step 2: Update Hotel Detail Screen

Load hotel data and add "Book" button:

```dart
// In hotel_detail.dart
@override
void initState() {
  super.initState();
  WidgetsBinding.instance.addPostFrameCallback((_) {
    final args = ModalRoute.of(context)?.settings.arguments as Map?;
    if (args != null) {
      setState(() {
        _hotel = args['hotel'];
        _hotelId = args['hotelId'];
        _checkInDate = args['checkInDate'];
        _checkOutDate = args['checkOutDate'];
      });
    }
  });
}

// Book button
ElevatedButton(
  onPressed: () {
    Navigator.pushNamed(
      context,
      '/room-selection',
      arguments: {
        'hotelId': _hotelId,
        'hotel': _hotel,
        'checkInDate': _checkInDate,
        'checkOutDate': _checkOutDate,
        'guests': _guests,
        'rooms': _rooms,
      },
    );
  },
  child: Text('Book Now'),
)
```

### Step 3: Implement Room Selection Screen

```dart
// In room_selection.dart
import '../../services/booking_service.dart';
import '../../models/room.dart';

class _RoomSelectionState extends State<RoomSelection> {
  final BookingService _bookingService = BookingService();
  List<Room> _rooms = [];
  bool _isLoading = true;
  
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadRooms();
    });
  }
  
  Future<void> _loadRooms() async {
    final args = ModalRoute.of(context)?.settings.arguments as Map?;
    final hotelId = args?['hotelId'];
    
    if (hotelId != null) {
      final result = await _bookingService.getHotelRooms(hotelId);
      
      if (result['success']) {
        setState(() {
          _rooms = result['rooms'];
          _isLoading = false;
        });
      }
    }
  }
  
  void _selectRoom(Room room) {
    Navigator.pushNamed(
      context,
      '/booking-checkout',
      arguments: {
        'hotel': _hotel,
        'room': room,
        'checkInDate': _checkInDate,
        'checkOutDate': _checkOutDate,
        'guests': _guests,
        'numberOfRooms': _numberOfRooms,
      },
    );
  }
}
```

### Step 4: Implement Booking Checkout Screen

```dart
// In booking_checkout.dart
import '../../services/booking_service.dart';
import '../../models/booking.dart';

class _BookingCheckoutState extends State<BookingCheckout> {
  final BookingService _bookingService = BookingService();
  final _formKey = GlobalKey<FormState>();
  
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _requestsController = TextEditingController();
  
  bool _isLoading = false;
  
  Future<void> _confirmBooking() async {
    if (!_formKey.currentState!.validate()) return;
    
    setState(() => _isLoading = true);
    
    final booking = Booking(
      userId: '', // Will be set by backend from token
      hotelId: _hotel['id'],
      hotelName: _hotel['name'],
      roomId: _room.id,
      roomType: _room.roomType,
      checkInDate: _checkInDate.toIso8601String().split('T')[0],
      checkOutDate: _checkOutDate.toIso8601String().split('T')[0],
      numberOfGuests: _guests,
      numberOfRooms: _numberOfRooms,
      numberOfNights: _numberOfNights,
      totalPrice: _totalPrice,
      status: 'PENDING',
      specialRequests: _requestsController.text,
      guestName: _nameController.text,
      guestEmail: _emailController.text,
      guestPhone: _phoneController.text,
    );
    
    final result = await _bookingService.createBooking(booking);
    
    setState(() => _isLoading = false);
    
    if (result['success']) {
      // Show success dialog
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: Text('Booking Confirmed!'),
          content: Text('Your booking has been confirmed.'),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).popUntil((route) => route.isFirst);
              },
              child: Text('OK'),
            ),
          ],
        ),
      );
    } else {
      // Show error
      Fluttertoast.showToast(
        msg: result['message'],
        backgroundColor: Colors.red,
      );
    }
  }
}
```

---

## 🧪 Testing the Complete Flow

### Step 1: Search Hotels
1. Open app
2. Select "New York"
3. Click "Search Hotels"

### Step 2: View Hotel Details
1. Tap on a hotel card
2. See hotel details, images, amenities
3. Scroll to "Book" button

### Step 3: Select Room
1. Tap "Book" button
2. See available rooms
3. Compare room types and prices
4. Tap "Select Room"

### Step 4: Checkout
1. Fill in guest details:
   - Name
   - Email
   - Phone
2. Review booking summary
3. Tap "Confirm Booking"

### Step 5: Confirmation
1. See success message
2. Booking created in backend
3. Can view in "My Bookings"

---

## 📊 Data Flow

```
Hotel Search Results
  ↓ (hotelId, hotel data, dates, guests)
Hotel Detail
  ↓ (hotelId, hotel data, dates, guests)
Room Selection
  ↓ API: GET /hotels/{id}/rooms
  ↓ (hotel, room, dates, guests)
Booking Checkout
  ↓ API: POST /bookings
  ↓ (booking confirmation)
Success!
```

---

## ✅ Implementation Checklist

- [x] Room model created
- [x] Booking model created
- [x] BookingService created
- [ ] Update hotel_search_results to pass hotel ID
- [ ] Update hotel_detail to load data and add Book button
- [ ] Update room_selection to load rooms from API
- [ ] Update booking_checkout to create booking
- [ ] Test complete flow end-to-end
- [ ] Handle authentication (must be logged in)
- [ ] Handle errors gracefully

---

## 🔐 Authentication Required

**Important:** Booking endpoints require authentication!

Make sure user is logged in before allowing booking:

```dart
// Check if user is logged in
final authService = AuthService();
final isLoggedIn = await authService.isLoggedIn();

if (!isLoggedIn) {
  // Navigate to login
  Navigator.pushNamed(context, '/login');
  return;
}
```

---

## 🎉 Next Steps

1. I'll update the Hotel Detail screen
2. Then Room Selection screen
3. Then Booking Checkout screen
4. Test the complete flow

**Ready to implement! Let me know if you want me to proceed with updating all screens.** 🚀
