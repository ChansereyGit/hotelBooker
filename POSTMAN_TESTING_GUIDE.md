# 🧪 Postman Testing Guide - Step by Step

Complete guide to test your Hotel Booking API with Postman.

---

## 📋 Prerequisites

1. **Backend is running** on `http://localhost:8080`
2. **Postman installed** (Download from https://www.postman.com/downloads/)
3. **PostgreSQL running** with database `hotelbooker`

---

## 🚀 Step 1: Setup Postman

### Create a New Collection

1. Open Postman
2. Click **"New"** → **"Collection"**
3. Name it: **"Hotel Booking API"**
4. Click **"Create"**

### Set Base URL Variable

1. Click on your collection **"Hotel Booking API"**
2. Go to **"Variables"** tab
3. Add a variable:
   - Variable: `baseUrl`
   - Initial Value: `http://localhost:8080/api/v1`
   - Current Value: `http://localhost:8080/api/v1`
4. Click **"Save"**

---

## 🧪 Step 2: Test Authentication

### Test 1: Register a New User

1. **Create New Request**
   - Click **"Add request"** in your collection
   - Name: `Register User`
   - Method: `POST`
   - URL: `{{baseUrl}}/auth/register`

2. **Set Headers**
   - Go to **"Headers"** tab
   - Add: `Content-Type: application/json`

3. **Set Body**
   - Go to **"Body"** tab
   - Select **"raw"** and **"JSON"**
   - Paste this:

```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phoneNumber": "+1234567890"
}
```

4. **Send Request**
   - Click **"Send"**
   - You should get **200 OK** response

5. **Expected Response:**

```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiJ9...",
    "tokenType": "Bearer",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "fullName": "John Doe",
      "email": "john@example.com",
      "phoneNumber": "+1234567890",
      "role": "USER",
      "emailVerified": false
    }
  },
  "timestamp": "2024-10-12T12:00:00"
}
```

6. **Save the Token**
   - Copy the `accessToken` value
   - We'll use it in the next steps

---

### Test 2: Login User

1. **Create New Request**
   - Name: `Login User`
   - Method: `POST`
   - URL: `{{baseUrl}}/auth/login`

2. **Set Headers**
   - `Content-Type: application/json`

3. **Set Body**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

4. **Send Request**
   - Click **"Send"**
   - You should get **200 OK** response

5. **Expected Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiJ9...",
    "tokenType": "Bearer",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "fullName": "John Doe",
      "email": "john@example.com",
      "phoneNumber": "+1234567890",
      "role": "USER",
      "emailVerified": false
    }
  },
  "timestamp": "2024-10-12T12:00:00"
}
```

6. **Save Token to Collection Variable**
   - Go to collection **"Variables"**
   - Add new variable:
     - Variable: `authToken`
     - Initial Value: (paste your token)
     - Current Value: (paste your token)
   - Click **"Save"**

---

### Test 3: Test Invalid Login

1. **Create New Request**
   - Name: `Login Invalid Credentials`
   - Method: `POST`
   - URL: `{{baseUrl}}/auth/login`

2. **Set Body**

```json
{
  "email": "john@example.com",
  "password": "wrongpassword"
}
```

3. **Send Request**
   - You should get **401 Unauthorized**

4. **Expected Response:**

```json
{
  "success": false,
  "message": "Invalid email or password",
  "timestamp": "2024-10-12T12:00:00"
}
```

---

## 🏨 Step 3: Test Hotel Endpoints

### Test 4: Add Sample Hotel (Manual Database Insert)

Before testing hotel search, let's add sample data:

1. **Open your PostgreSQL client** (pgAdmin, DBeaver, or psql)

2. **Connect to database** `hotelbooker`

3. **Run this SQL:**

```sql
-- Insert sample hotel
INSERT INTO hotels (id, name, description, address, city, country, 
                    price_per_night, star_rating, guest_rating, 
                    featured, available, created_at, updated_at)
VALUES 
('550e8400-e29b-41d4-a716-446655440001', 
 'Grand Plaza Hotel', 
 'Luxury 5-star hotel in the heart of the city with stunning views', 
 '123 Main Street', 
 'New York', 
 'USA', 
 250.00, 
 5, 
 4.8, 
 true, 
 true, 
 NOW(), 
 NOW()),
 
('550e8400-e29b-41d4-a716-446655440002', 
 'Seaside Resort', 
 'Beautiful beachfront resort with private beach access', 
 '456 Ocean Drive', 
 'Miami', 
 'USA', 
 180.00, 
 4, 
 4.5, 
 true, 
 true, 
 NOW(), 
 NOW()),
 
('550e8400-e29b-41d4-a716-446655440003', 
 'Mountain View Lodge', 
 'Cozy mountain retreat with breathtaking views', 
 '789 Mountain Road', 
 'Denver', 
 'USA', 
 120.00, 
 3, 
 4.2, 
 false, 
 true, 
 NOW(), 
 NOW());

-- Insert hotel amenities
INSERT INTO hotel_amenities (hotel_id, amenity)
VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'Free WiFi'),
('550e8400-e29b-41d4-a716-446655440001', 'Swimming Pool'),
('550e8400-e29b-41d4-a716-446655440001', 'Gym'),
('550e8400-e29b-41d4-a716-446655440001', 'Restaurant'),
('550e8400-e29b-41d4-a716-446655440001', 'Spa'),
('550e8400-e29b-41d4-a716-446655440002', 'Free WiFi'),
('550e8400-e29b-41d4-a716-446655440002', 'Beach Access'),
('550e8400-e29b-41d4-a716-446655440002', 'Pool'),
('550e8400-e29b-41d4-a716-446655440003', 'Free WiFi'),
('550e8400-e29b-41d4-a716-446655440003', 'Parking');

-- Insert hotel images
INSERT INTO hotel_images (hotel_id, image_url)
VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'https://images.unsplash.com/photo-1566073771259-6a8506099945'),
('550e8400-e29b-41d4-a716-446655440002', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4'),
('550e8400-e29b-41d4-a716-446655440003', 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb');

-- Insert sample rooms
INSERT INTO rooms (id, hotel_id, room_type, description, price_per_night, 
                   max_guests, total_rooms, available_rooms, size, 
                   bed_type, has_breakfast, free_cancellation, 
                   created_at, updated_at)
VALUES 
('660e8400-e29b-41d4-a716-446655440001',
 '550e8400-e29b-41d4-a716-446655440001',
 'Deluxe King Room',
 'Spacious room with king bed and city view',
 250.00,
 2,
 10,
 10,
 35.0,
 'King',
 true,
 true,
 NOW(),
 NOW()),
 
('660e8400-e29b-41d4-a716-446655440002',
 '550e8400-e29b-41d4-a716-446655440001',
 'Executive Suite',
 'Luxury suite with separate living area',
 400.00,
 4,
 5,
 5,
 60.0,
 'King',
 true,
 true,
 NOW(),
 NOW()),
 
('660e8400-e29b-41d4-a716-446655440003',
 '550e8400-e29b-41d4-a716-446655440002',
 'Ocean View Room',
 'Beautiful room with ocean view',
 180.00,
 2,
 15,
 15,
 30.0,
 'Queen',
 true,
 false,
 NOW(),
 NOW());

-- Insert room amenities
INSERT INTO room_amenities (room_id, amenity)
VALUES 
('660e8400-e29b-41d4-a716-446655440001', 'WiFi'),
('660e8400-e29b-41d4-a716-446655440001', 'TV'),
('660e8400-e29b-41d4-a716-446655440001', 'Mini Bar'),
('660e8400-e29b-41d4-a716-446655440002', 'WiFi'),
('660e8400-e29b-41d4-a716-446655440002', 'TV'),
('660e8400-e29b-41d4-a716-446655440002', 'Jacuzzi'),
('660e8400-e29b-41d4-a716-446655440003', 'WiFi'),
('660e8400-e29b-41d4-a716-446655440003', 'TV');
```

---

### Test 5: Search Hotels

1. **Create New Request**
   - Name: `Search Hotels`
   - Method: `POST`
   - URL: `{{baseUrl}}/hotels/search`

2. **Set Headers**
   - `Content-Type: application/json`

3. **Set Body** (Search by location)

```json
{
  "location": "New York"
}
```

4. **Send Request**
   - You should get **200 OK** with hotel list

5. **Expected Response:**

```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Grand Plaza Hotel",
      "description": "Luxury 5-star hotel in the heart of the city with stunning views",
      "address": "123 Main Street",
      "city": "New York",
      "country": "USA",
      "pricePerNight": 250.0,
      "guestRating": 4.8,
      "totalReviews": 0,
      "starRating": 5,
      "images": ["https://images.unsplash.com/photo-1566073771259-6a8506099945"],
      "amenities": ["Free WiFi", "Swimming Pool", "Gym", "Restaurant", "Spa"],
      "featured": true,
      "available": true
    }
  ],
  "timestamp": "2024-10-12T12:00:00"
}
```

---

### Test 6: Search Hotels with Filters

1. **Create New Request**
   - Name: `Search Hotels with Filters`
   - Method: `POST`
   - URL: `{{baseUrl}}/hotels/search`

2. **Set Body**

```json
{
  "location": "USA",
  "minPrice": 100,
  "maxPrice": 200,
  "minStarRating": 3,
  "minGuestRating": 4.0
}
```

3. **Send Request**
   - Should return hotels matching the filters

---

### Test 7: Get Hotel Details

1. **Create New Request**
   - Name: `Get Hotel Details`
   - Method: `GET`
   - URL: `{{baseUrl}}/hotels/550e8400-e29b-41d4-a716-446655440001`

2. **Send Request**
   - You should get **200 OK** with hotel details

3. **Expected Response:**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "Grand Plaza Hotel",
    "description": "Luxury 5-star hotel in the heart of the city with stunning views",
    "address": "123 Main Street",
    "city": "New York",
    "country": "USA",
    "pricePerNight": 250.0,
    "guestRating": 4.8,
    "totalReviews": 0,
    "starRating": 5,
    "images": ["https://images.unsplash.com/photo-1566073771259-6a8506099945"],
    "amenities": ["Free WiFi", "Swimming Pool", "Gym", "Restaurant", "Spa"],
    "featured": true,
    "available": true
  },
  "timestamp": "2024-10-12T12:00:00"
}
```

---

### Test 8: Get Hotel Rooms

1. **Create New Request**
   - Name: `Get Hotel Rooms`
   - Method: `GET`
   - URL: `{{baseUrl}}/hotels/550e8400-e29b-41d4-a716-446655440001/rooms`

2. **Send Request**
   - You should get **200 OK** with room list

3. **Expected Response:**

```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "hotelId": "550e8400-e29b-41d4-a716-446655440001",
      "roomType": "Deluxe King Room",
      "description": "Spacious room with king bed and city view",
      "pricePerNight": 250.0,
      "maxGuests": 2,
      "totalRooms": 10,
      "availableRooms": 10,
      "size": 35.0,
      "images": [],
      "amenities": ["WiFi", "TV", "Mini Bar"],
      "bedType": "King",
      "hasBreakfast": true,
      "freeCancellation": true
    }
  ],
  "timestamp": "2024-10-12T12:00:00"
}
```

---

### Test 9: Get Featured Hotels

1. **Create New Request**
   - Name: `Get Featured Hotels`
   - Method: `GET`
   - URL: `{{baseUrl}}/hotels/featured`

2. **Send Request**
   - Should return featured hotels

---

### Test 10: Get Popular Destinations

1. **Create New Request**
   - Name: `Get Popular Destinations`
   - Method: `GET`
   - URL: `{{baseUrl}}/hotels/destinations`

2. **Send Request**
   - Should return list of cities

3. **Expected Response:**

```json
{
  "success": true,
  "message": "Success",
  "data": ["Denver", "Miami", "New York"],
  "timestamp": "2024-10-12T12:00:00"
}
```

---

## 📅 Step 4: Test Booking Endpoints (Authenticated)

### Test 11: Create Booking

1. **Create New Request**
   - Name: `Create Booking`
   - Method: `POST`
   - URL: `{{baseUrl}}/bookings`

2. **Set Headers**
   - `Content-Type: application/json`
   - `Authorization: Bearer {{authToken}}`

3. **Set Body**

```json
{
  "hotelId": "550e8400-e29b-41d4-a716-446655440001",
  "roomId": "660e8400-e29b-41d4-a716-446655440001",
  "checkInDate": "2024-12-20",
  "checkOutDate": "2024-12-25",
  "numberOfGuests": 2,
  "numberOfRooms": 1,
  "specialRequests": "Late check-in please",
  "guestName": "John Doe",
  "guestEmail": "john@example.com",
  "guestPhone": "+1234567890"
}
```

4. **Send Request**
   - You should get **200 OK** with booking confirmation

5. **Expected Response:**

```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440001",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "hotelId": "550e8400-e29b-41d4-a716-446655440001",
    "hotelName": "Grand Plaza Hotel",
    "roomId": "660e8400-e29b-41d4-a716-446655440001",
    "roomType": "Deluxe King Room",
    "checkInDate": "2024-12-20",
    "checkOutDate": "2024-12-25",
    "numberOfGuests": 2,
    "numberOfRooms": 1,
    "numberOfNights": 5,
    "totalPrice": 1250.0,
    "status": "PENDING",
    "specialRequests": "Late check-in please",
    "guestName": "John Doe",
    "guestEmail": "john@example.com",
    "guestPhone": "+1234567890"
  },
  "timestamp": "2024-10-12T12:00:00"
}
```

6. **Save Booking ID**
   - Copy the booking `id` for next tests

---

### Test 12: Get User Bookings

1. **Create New Request**
   - Name: `Get User Bookings`
   - Method: `GET`
   - URL: `{{baseUrl}}/bookings`

2. **Set Headers**
   - `Authorization: Bearer {{authToken}}`

3. **Send Request**
   - Should return all user's bookings

---

### Test 13: Get Booking Details

1. **Create New Request**
   - Name: `Get Booking Details`
   - Method: `GET`
   - URL: `{{baseUrl}}/bookings/770e8400-e29b-41d4-a716-446655440001`
   - (Replace with your actual booking ID)

2. **Set Headers**
   - `Authorization: Bearer {{authToken}}`

3. **Send Request**
   - Should return booking details

---

### Test 14: Get Upcoming Bookings

1. **Create New Request**
   - Name: `Get Upcoming Bookings`
   - Method: `GET`
   - URL: `{{baseUrl}}/bookings/upcoming`

2. **Set Headers**
   - `Authorization: Bearer {{authToken}}`

3. **Send Request**
   - Should return future bookings

---

### Test 15: Cancel Booking

1. **Create New Request**
   - Name: `Cancel Booking`
   - Method: `POST`
   - URL: `{{baseUrl}}/bookings/770e8400-e29b-41d4-a716-446655440001/cancel`
   - (Replace with your actual booking ID)

2. **Set Headers**
   - `Authorization: Bearer {{authToken}}`

3. **Send Request**
   - Should return cancelled booking

4. **Expected Response:**

```json
{
  "success": true,
  "message": "Booking cancelled successfully",
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440001",
    "status": "CANCELLED",
    ...
  },
  "timestamp": "2024-10-12T12:00:00"
}
```

---

## 🧪 Step 5: Test Error Cases

### Test 16: Unauthorized Access

1. **Create New Request**
   - Name: `Unauthorized Booking Access`
   - Method: `GET`
   - URL: `{{baseUrl}}/bookings`

2. **Don't set Authorization header**

3. **Send Request**
   - Should get **403 Forbidden**

---

### Test 17: Invalid Hotel ID

1. **Create New Request**
   - Name: `Get Invalid Hotel`
   - Method: `GET`
   - URL: `{{baseUrl}}/hotels/invalid-id-123`

2. **Send Request**
   - Should get **404 Not Found**

---

## 📊 Complete Test Checklist

- [ ] Register User
- [ ] Login User
- [ ] Test Invalid Login
- [ ] Add Sample Data to Database
- [ ] Search Hotels
- [ ] Search Hotels with Filters
- [ ] Get Hotel Details
- [ ] Get Hotel Rooms
- [ ] Get Featured Hotels
- [ ] Get Popular Destinations
- [ ] Create Booking (with auth)
- [ ] Get User Bookings (with auth)
- [ ] Get Booking Details (with auth)
- [ ] Get Upcoming Bookings (with auth)
- [ ] Cancel Booking (with auth)
- [ ] Test Unauthorized Access
- [ ] Test Invalid Hotel ID

---

## 💡 Pro Tips

1. **Save Collection**: Export your Postman collection for backup
2. **Environment Variables**: Use variables for tokens and IDs
3. **Tests Tab**: Add automated tests in Postman
4. **Console**: Check Postman console for detailed request/response
5. **Backend Logs**: Watch backend console for errors

---

## 🐛 Troubleshooting

### "Connection refused"
- Make sure backend is running: `mvn spring-boot:run`

### "401 Unauthorized"
- Check if token is valid
- Token might be expired (24 hours)
- Login again to get new token

### "404 Not Found"
- Check if hotel/booking ID exists
- Verify the URL is correct

### "500 Internal Server Error"
- Check backend console logs
- Verify database is running
- Check if sample data is inserted

---

## 🎉 Success!

If all tests pass, your backend is working perfectly and ready for Flutter integration!

**Next Step**: Follow `backend/FLUTTER_INTEGRATION.md` to connect your Flutter app.
