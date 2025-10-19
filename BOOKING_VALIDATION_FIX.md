# Booking Validation Fix

## Problem
Payment was succeeding but booking creation was failing with the error:
```
"Payment successful but booking failed"
```

## Root Cause
The `CreateBookingRequest` DTO had `@Future` validation constraints on check-in and check-out dates:
```java
@Future(message = "Check-in date must be in the future")
private LocalDate checkInDate;

@Future(message = "Check-out date must be in the future")
private LocalDate checkOutDate;
```

The `@Future` annotation requires dates to be **strictly in the future** (tomorrow or later), which means:
- ❌ Today's date fails validation
- ❌ Past dates fail validation
- ✅ Only future dates pass

This caused booking creation to fail after payment was already processed.

## Solution
Changed validation from `@Future` to `@FutureOrPresent`:
```java
@FutureOrPresent(message = "Check-in date cannot be in the past")
private LocalDate checkInDate;

@FutureOrPresent(message = "Check-out date cannot be in the past")
private LocalDate checkOutDate;
```

The `@FutureOrPresent` annotation allows:
- ✅ Today's date
- ✅ Future dates
- ❌ Only past dates fail

## Testing
1. Restart the backend server to apply changes
2. Try booking with today's date or future dates
3. Payment should succeed AND booking should be created successfully

## Files Modified
- `backend/src/main/java/com/hotelbooker/booking/dto/CreateBookingRequest.java`
