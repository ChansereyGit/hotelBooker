# Hotel Booking Flow - Visual Diagram

## Complete User Journey

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         HOTEL BOOKING FLOW                               │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│  1. HOME SCREEN  │
│                  │
│  [Search Form]   │
│  • Location      │
│  • Check-in      │
│  • Check-out     │
│  • Guests        │
│  • Rooms         │
│                  │
│  [Search Button] │
└────────┬─────────┘
         │
         │ POST /api/hotels/search
         │ {location, dates, guests, rooms}
         ↓
┌──────────────────┐
│  2. SEARCH       │
│     RESULTS      │
│                  │
│  ┌────────────┐  │
│  │ Hotel Card │  │ ← Click on any hotel
│  │ • Image    │  │
│  │ • Name     │  │
│  │ • Rating   │  │
│  │ • Price    │  │
│  └────────────┘  │
│                  │
│  [Filter/Sort]   │
└────────┬─────────┘
         │
         │ Navigate with hotel data
         │ + search parameters
         ↓
┌──────────────────┐
│  3. HOTEL        │
│     DETAIL       │
│                  │
│  [Image Gallery] │
│                  │
│  Hotel Info:     │
│  • Name          │
│  • Rating        │
│  • Location      │
│  • Description   │
│                  │
│  [Amenities]     │
│  • WiFi          │
│  • Pool          │
│  • Spa           │
│                  │
│  [Available      │
│   Rooms]         │
│  ┌────────────┐  │
│  │ Room Type  │  │
│  │ $299/night │  │
│  └────────────┘  │
│                  │
│  [Reviews]       │
│                  │
│  [Location Map]  │
│                  │
│  [Book Now] ─────┼─────┐
└──────────────────┘     │
                         │ GET /api/hotels/{id}/rooms
                         │
                         ↓
                ┌──────────────────┐
                │  4. ROOM         │
                │     SELECTION    │
                │                  │
                │  Booking Summary │
                │  • Check-in      │
                │  • Check-out     │
                │  • 3 nights      │
                │  • 2 guests      │
                │                  │
                │  Available Rooms:│
                │  ┌────────────┐  │
                │  │ Deluxe King│  │ ← Select room
                │  │ • King Bed │  │
                │  │ • 35 m²    │  │
                │  │ • $299/nt  │  │
                │  │ ✓ Selected │  │
                │  └────────────┘  │
                │                  │
                │  ┌────────────┐  │
                │  │ Twin Room  │  │
                │  │ • 2 Twins  │  │
                │  │ • 30 m²    │  │
                │  │ • $249/nt  │  │
                │  └────────────┘  │
                │                  │
                │  [Filter/Sort]   │
                │                  │
                │  Total: $897     │
                │  [Continue] ─────┼─────┐
                └──────────────────┘     │
                                         │
                                         ↓
                                ┌──────────────────┐
                                │  5. BOOKING      │
                                │     CHECKOUT     │
                                │                  │
                                │  Progress:       │
                                │  [1]─[2]─[3]     │
                                │                  │
                                │  ┌─────────────┐ │
                                │  │ STEP 1:     │ │
                                │  │ Guest Info  │ │
                                │  │             │ │
                                │  │ • First Name│ │
                                │  │ • Last Name │ │
                                │  │ • Email     │ │
                                │  │ • Phone     │ │
                                │  │ • Special   │ │
                                │  │   Requests  │ │
                                │  └─────────────┘ │
                                │                  │
                                │  [Continue] ─────┼───┐
                                └──────────────────┘   │
                                                       │
                                                       ↓
                                              ┌──────────────────┐
                                              │  STEP 2:         │
                                              │  Payment         │
                                              │                  │
                                              │  • Card Number   │
                                              │  • Expiry        │
                                              │  • CVV           │
                                              │  • Cardholder    │
                                              │                  │
                                              │  ☑ Accept Terms  │
                                              │                  │
                                              │  [Review] ───────┼───┐
                                              └──────────────────┘   │
                                                                     │
                                                                     ↓
                                                            ┌──────────────────┐
                                                            │  STEP 3:         │
                                                            │  Confirmation    │
                                                            │                  │
                                                            │  Review Details: │
                                                            │  • Guest Info    │
                                                            │  • Payment       │
                                                            │  • Total: $1,032 │
                                                            │    (incl. tax)   │
                                                            │                  │
                                                            │  [Complete] ─────┼───┐
                                                            └──────────────────┘   │
                                                                                   │
                                                                                   │ POST /api/bookings
                                                                                   │ {booking details}
                                                                                   ↓
                                                                          ┌──────────────────┐
                                                                          │  6. SUCCESS      │
                                                                          │                  │
                                                                          │  ✓ Booking       │
                                                                          │    Confirmed!    │
                                                                          │                  │
                                                                          │  Reference:      │
                                                                          │  HB123456789     │
                                                                          │                  │
                                                                          │  Email sent to:  │
                                                                          │  user@email.com  │
                                                                          │                  │
                                                                          │  [View Bookings] │
                                                                          │  [Done]          │
                                                                          └──────────────────┘
```

## Data Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Search    │────▶│   Results   │────▶│   Detail    │────▶│    Rooms    │
│             │     │             │     │             │     │             │
│ • Location  │     │ • Hotels[]  │     │ • Hotel     │     │ • Rooms[]   │
│ • Dates     │     │ • Filters   │     │ • Images    │     │ • Prices    │
│ • Guests    │     │ • Sort      │     │ • Amenities │     │ • Available │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                                                                    │
                                                                    ↓
                                                            ┌─────────────┐
                                                            │  Checkout   │
                                                            │             │
                                                            │ • Guest     │
                                                            │ • Payment   │
                                                            │ • Confirm   │
                                                            └─────────────┘
                                                                    │
                                                                    ↓
                                                            ┌─────────────┐
                                                            │   Backend   │
                                                            │             │
                                                            │ • Create    │
                                                            │ • Validate  │
                                                            │ • Save      │
                                                            └─────────────┘
```

## API Calls Timeline

```
User Action                 API Call                        Response
───────────────────────────────────────────────────────────────────────────
1. Search hotels       →    POST /api/hotels/search    →   Hotels[]
                            
2. Click hotel         →    GET /api/hotels/{id}       →   Hotel details
                            
3. View rooms          →    GET /api/hotels/{id}/rooms →   Rooms[]
                            
4. Complete booking    →    POST /api/bookings         →   Booking confirmed
                            
5. View confirmation   →    (Local data display)       →   Success screen
```

## State Management

```
┌─────────────────────────────────────────────────────────────┐
│                    Application State                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Search Parameters:                                          │
│  • location: String                                          │
│  • checkInDate: DateTime                                     │
│  • checkOutDate: DateTime                                    │
│  • guests: int                                               │
│  • rooms: int                                                │
│                                                              │
│  Selected Data:                                              │
│  • selectedHotel: Hotel?                                     │
│  • selectedRoom: Room?                                       │
│  • nights: int                                               │
│  • totalPrice: double                                        │
│                                                              │
│  User Data:                                                  │
│  • guestName: String                                         │
│  • guestEmail: String                                        │
│  • guestPhone: String                                        │
│  • specialRequests: String?                                  │
│                                                              │
│  Booking Result:                                             │
│  • bookingId: String?                                        │
│  • status: String                                            │
│  • confirmationSent: bool                                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Navigation Routes

```
/hotel-search-home
    │
    ├─▶ /hotel-search-results
    │       │
    │       └─▶ /hotel-detail
    │               │
    │               └─▶ /room-selection
    │                       │
    │                       └─▶ /booking-checkout
    │                               │
    │                               └─▶ Success Dialog
    │                                       │
    │                                       └─▶ /hotel-search-home
    │
    └─▶ /login (if not authenticated)
```

## Key Features by Screen

### 1. Search Results
- ✅ Display hotels from API
- ✅ Filter by price, rating, amenities
- ✅ Sort by price, distance, rating
- ✅ Pull to refresh
- ✅ Infinite scroll (if implemented)

### 2. Hotel Detail
- ✅ Image gallery with swipe
- ✅ Hotel information
- ✅ Amenities list
- ✅ Reviews section
- ✅ Location map
- ✅ Available rooms preview
- ✅ Sticky booking bar

### 3. Room Selection
- ✅ Room cards with details
- ✅ Price calculation
- ✅ Filter available/offers
- ✅ Sort by price/size
- ✅ Expandable room details
- ✅ Selection indicator
- ✅ Booking summary

### 4. Checkout
- ✅ 3-step progress indicator
- ✅ Guest information form
- ✅ Payment details form
- ✅ Booking review
- ✅ Terms acceptance
- ✅ Loading states
- ✅ Error handling
- ✅ Success/failure dialogs

## Error Scenarios

```
┌─────────────────────┐
│  Error Handling     │
├─────────────────────┤
│                     │
│ Network Error       │
│  ↓                  │
│  Show toast         │
│  Retry button       │
│                     │
│ Validation Error    │
│  ↓                  │
│  Highlight field    │
│  Show message       │
│                     │
│ Booking Failed      │
│  ↓                  │
│  Error dialog       │
│  Retry/Cancel       │
│                     │
│ Auth Required       │
│  ↓                  │
│  Redirect to login  │
│  Return after auth  │
│                     │
└─────────────────────┘
```
