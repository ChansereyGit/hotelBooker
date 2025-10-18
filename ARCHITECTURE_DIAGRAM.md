# Architecture Diagram

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FLUTTER APP                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  Login   │  │  Search  │  │  Hotel   │  │ Booking  │       │
│  │  Screen  │  │  Screen  │  │  Detail  │  │ Checkout │       │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘       │
│       │             │              │              │              │
│  ┌────┴─────────────┴──────────────┴──────────────┴─────┐      │
│  │              API Service Layer                         │      │
│  │  (Dio HTTP Client + JWT Token Management)             │      │
│  └────────────────────────┬───────────────────────────────┘      │
└───────────────────────────┼──────────────────────────────────────┘
                            │
                            │ HTTP/REST API
                            │ (JSON)
                            │
┌───────────────────────────┼──────────────────────────────────────┐
│                           ▼                                       │
│                  SPRING BOOT BACKEND                              │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              Security Layer (JWT Filter)                    │ │
│  │  - Validates JWT tokens                                     │ │
│  │  - Extracts user information                                │ │
│  └────────────────────────┬───────────────────────────────────┘ │
│                           │                                       │
│  ┌────────────────────────┴───────────────────────────────────┐ │
│  │                   Controller Layer                          │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │ │
│  │  │   Auth   │  │  Hotel   │  │ Booking  │                 │ │
│  │  │Controller│  │Controller│  │Controller│                 │ │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘                 │ │
│  └───────┼─────────────┼─────────────┼────────────────────────┘ │
│          │             │             │                           │
│  ┌───────┼─────────────┼─────────────┼────────────────────────┐ │
│  │       ▼             ▼             ▼     Service Layer       │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │ │
│  │  │   Auth   │  │  Hotel   │  │ Booking  │                 │ │
│  │  │ Service  │  │ Service  │  │ Service  │                 │ │
│  │  │          │  │          │  │          │                 │ │
│  │  │ - Login  │  │ - Search │  │ - Create │                 │ │
│  │  │ - Reg.   │  │ - Filter │  │ - Cancel │                 │ │
│  │  │ - JWT    │  │ - Details│  │ - List   │                 │ │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘                 │ │
│  └───────┼─────────────┼─────────────┼────────────────────────┘ │
│          │             │             │                           │
│  ┌───────┼─────────────┼─────────────┼────────────────────────┐ │
│  │       ▼             ▼             ▼   Repository Layer      │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │ │
│  │  │   User   │  │  Hotel   │  │ Booking  │                 │ │
│  │  │   Repo   │  │   Repo   │  │   Repo   │                 │ │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘                 │ │
│  └───────┼─────────────┼─────────────┼────────────────────────┘ │
└──────────┼─────────────┼─────────────┼──────────────────────────┘
           │             │             │
           └─────────────┴─────────────┘
                         │
                         ▼
           ┌─────────────────────────┐
           │   PostgreSQL Database   │
           │                         │
           │  ┌─────────────────┐   │
           │  │  users          │   │
           │  │  hotels         │   │
           │  │  rooms          │   │
           │  │  bookings       │   │
           │  └─────────────────┘   │
           └─────────────────────────┘
```

## 🔄 Request Flow Examples

### 1. User Login Flow

```
┌─────────┐                                                    ┌──────────┐
│ Flutter │                                                    │ Backend  │
│   App   │                                                    │          │
└────┬────┘                                                    └────┬─────┘
     │                                                              │
     │  POST /api/v1/auth/login                                    │
     │  { email, password }                                        │
     ├────────────────────────────────────────────────────────────>│
     │                                                              │
     │                                    AuthController receives  │
     │                                    ├─> AuthService          │
     │                                    │   ├─> Validate creds   │
     │                                    │   ├─> UserRepository   │
     │                                    │   └─> JwtService       │
     │                                    │       (generate token) │
     │                                                              │
     │  { success: true, accessToken, user }                       │
     │<────────────────────────────────────────────────────────────┤
     │                                                              │
     │  Save token to SharedPreferences                            │
     │  Navigate to Home Screen                                    │
     │                                                              │
```

### 2. Hotel Search Flow

```
┌─────────┐                                                    ┌──────────┐
│ Flutter │                                                    │ Backend  │
│   App   │                                                    │          │
└────┬────┘                                                    └────┬─────┘
     │                                                              │
     │  POST /api/v1/hotels/search                                 │
     │  { location: "New York", minPrice: 100 }                    │
     ├────────────────────────────────────────────────────────────>│
     │                                                              │
     │                                   HotelController receives   │
     │                                   ├─> HotelService           │
     │                                   │   ├─> Apply filters      │
     │                                   │   └─> HotelRepository    │
     │                                   │       (query database)   │
     │                                                              │
     │  { success: true, data: [hotels...] }                       │
     │<────────────────────────────────────────────────────────────┤
     │                                                              │
     │  Display hotel list                                         │
     │                                                              │
```

### 3. Create Booking Flow (Authenticated)

```
┌─────────┐                                                    ┌──────────┐
│ Flutter │                                                    │ Backend  │
│   App   │                                                    │          │
└────┬────┘                                                    └────┬─────┘
     │                                                              │
     │  POST /api/v1/bookings                                      │
     │  Authorization: Bearer <token>                              │
     │  { hotelId, roomId, checkIn, checkOut, guests }             │
     ├────────────────────────────────────────────────────────────>│
     │                                                              │
     │                                    JwtAuthenticationFilter   │
     │                                    ├─> Validate token        │
     │                                    ├─> Extract user          │
     │                                    └─> Set SecurityContext   │
     │                                                              │
     │                                    BookingController         │
     │                                    ├─> BookingService        │
     │                                    │   ├─> Validate dates    │
     │                                    │   ├─> Check availability│
     │                                    │   ├─> Calculate price   │
     │                                    │   ├─> Update room count │
     │                                    │   └─> Save booking      │
     │                                                              │
     │  { success: true, booking: {...} }                          │
     │<────────────────────────────────────────────────────────────┤
     │                                                              │
     │  Show confirmation screen                                   │
     │                                                              │
```

## 📦 Module Dependencies

```
┌─────────────────────────────────────────────────────────┐
│                    Common Module                        │
│  - ApiResponse                                          │
│  - BaseEntity                                           │
│  - GlobalExceptionHandler                               │
│  - ResourceNotFoundException                            │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ (Used by all modules)
                     │
     ┌───────────────┼───────────────┐
     │               │               │
     ▼               ▼               ▼
┌─────────┐    ┌─────────┐    ┌─────────┐
│  Auth   │    │  Hotel  │    │ Booking │
│ Module  │    │ Module  │    │ Module  │
│         │    │         │    │         │
│ - User  │    │ - Hotel │    │ - Booking│
│ - JWT   │◄───┤ - Room  │◄───┤ (refs   │
│         │    │         │    │  User,  │
│         │    │         │    │  Hotel, │
│         │    │         │    │  Room)  │
└─────────┘    └─────────┘    └─────────┘
```

## 🔐 Security Flow

```
┌──────────────────────────────────────────────────────────┐
│                    Request Flow                          │
└──────────────────────────────────────────────────────────┘

1. Flutter sends request with JWT token
   ↓
2. JwtAuthenticationFilter intercepts
   ↓
3. Extract token from Authorization header
   ↓
4. Validate token (signature, expiration)
   ↓
5. Extract user email from token
   ↓
6. Load user from database
   ↓
7. Set SecurityContext with user details
   ↓
8. Continue to Controller
   ↓
9. Controller can access current user
   ↓
10. Process request
    ↓
11. Return response
```

## 🗄️ Database Relationships

```
┌─────────────┐
│    users    │
│             │
│ - id (PK)   │
│ - email     │
│ - password  │
│ - fullName  │
└──────┬──────┘
       │
       │ 1:N
       │
       ▼
┌─────────────┐         ┌─────────────┐
│  bookings   │    N:1  │   hotels    │
│             │◄────────┤             │
│ - id (PK)   │         │ - id (PK)   │
│ - user_id   │         │ - name      │
│ - hotel_id  │         │ - city      │
│ - room_id   │         │ - price     │
│ - checkIn   │         └──────┬──────┘
│ - checkOut  │                │
│ - total     │                │ 1:N
└──────┬──────┘                │
       │                       ▼
       │ N:1            ┌─────────────┐
       └───────────────>│    rooms    │
                        │             │
                        │ - id (PK)   │
                        │ - hotel_id  │
                        │ - roomType  │
                        │ - price     │
                        │ - available │
                        └─────────────┘
```

## 🎯 API Endpoints Map

```
/api/v1
├── /auth (Public)
│   ├── POST /register
│   └── POST /login
│
├── /hotels (Public for search, Auth for favorites)
│   ├── POST /search
│   ├── GET  /{id}
│   ├── GET  /{id}/rooms
│   ├── GET  /featured
│   └── GET  /destinations
│
└── /bookings (Authenticated)
    ├── POST /
    ├── GET  /
    ├── GET  /{id}
    ├── GET  /upcoming
    └── POST /{id}/cancel
```

## 📱 Flutter-Backend Integration

```
Flutter App Structure          Backend Module
─────────────────────         ──────────────

LoginScreen                   ←→  Auth Module
  └─> AuthService                  └─> /auth/login
                                       /auth/register

HotelSearchHome              ←→  Hotel Module
  └─> HotelService                 └─> /hotels/search
                                       /hotels/featured

HotelSearchResults           ←→  Hotel Module
  └─> HotelService                 └─> /hotels/search

HotelDetail                  ←→  Hotel Module
  └─> HotelService                 └─> /hotels/{id}

RoomSelection                ←→  Hotel Module
  └─> HotelService                 └─> /hotels/{id}/rooms

BookingCheckout              ←→  Booking Module
  └─> BookingService               └─> /bookings
```

## 🚀 Deployment Architecture (Future)

```
┌─────────────────────────────────────────────────────────┐
│                    Production Setup                      │
└─────────────────────────────────────────────────────────┘

Flutter Web/Mobile
       │
       │ HTTPS
       ▼
┌─────────────┐
│   Nginx     │  (Reverse Proxy)
│   + SSL     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Spring Boot │  (Backend)
│   App       │
└──────┬──────┘
       │
       ├──────────────┐
       │              │
       ▼              ▼
┌─────────────┐  ┌─────────────┐
│ PostgreSQL  │  │   Redis     │
│  Database   │  │   Cache     │
└─────────────┘  └─────────────┘

Hosting Options:
- Railway (Recommended)
- Heroku
- AWS EC2
- DigitalOcean
```

---

This architecture provides:
✅ Clear separation of concerns
✅ Easy to understand and maintain
✅ Scalable for future growth
✅ Perfect for learning
✅ Production-ready
