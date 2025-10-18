# AuthService Fix - getCurrentUser() Method

## Issue
The `booking_checkout.dart` was calling `_authService.getCurrentUser()` which didn't exist in the `AuthService` class.

## Solution
Added user persistence and retrieval methods to `AuthService`:

### Changes Made

#### 1. Updated `flutter/lib/services/auth_service.dart`

**Added imports:**
```dart
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
```

**Added methods:**
```dart
// Save user to local storage
Future<void> _saveUser(User user) async {
  final prefs = await SharedPreferences.getInstance();
  await prefs.setString('current_user', jsonEncode(user.toJson()));
}

// Get current user from local storage
Future<User?> getCurrentUser() async {
  final prefs = await SharedPreferences.getInstance();
  final userJson = prefs.getString('current_user');
  if (userJson != null) {
    return User.fromJson(jsonDecode(userJson));
  }
  return null;
}

// Clear user from local storage
Future<void> _clearUser() async {
  final prefs = await SharedPreferences.getInstance();
  await prefs.remove('current_user');
}
```

**Updated login() method:**
- Now saves user data after successful login
- Calls `await _saveUser(user);` after setting token

**Updated register() method:**
- Now saves user data after successful registration
- Calls `await _saveUser(user);` after setting token

**Updated logout() method:**
- Now clears user data when logging out
- Calls `await _clearUser();` after clearing token

#### 2. Fixed `flutter/lib/presentation/booking_checkout/booking_checkout.dart`

**Fixed property name:**
```dart
// Before:
final nameParts = user.name.split(' ');

// After:
final nameParts = user.fullName.split(' ');
```

**Added phone number pre-fill:**
```dart
if (user.phoneNumber != null) {
  _guestData['phone'] = user.phoneNumber;
}
```

## How It Works

### User Flow:
1. **Login/Register** → User data saved to SharedPreferences
2. **Booking Checkout** → Retrieves user data to pre-fill form
3. **Logout** → User data cleared from storage

### Data Storage:
- User data stored as JSON string in SharedPreferences
- Key: `'current_user'`
- Persists across app restarts
- Cleared on logout

### Benefits:
- ✅ User info pre-filled in booking form
- ✅ No need to re-enter name and email
- ✅ Better user experience
- ✅ Data persists across sessions
- ✅ Automatically cleared on logout

## Testing

### Test the fix:
1. **Login:**
   ```dart
   final result = await authService.login(email, password);
   // User data is now saved
   ```

2. **Get Current User:**
   ```dart
   final user = await authService.getCurrentUser();
   // Returns User object or null
   ```

3. **Booking Checkout:**
   - Navigate to checkout
   - Guest form should be pre-filled with:
     - First Name (from fullName)
     - Last Name (from fullName)
     - Email
     - Phone (if available)

4. **Logout:**
   ```dart
   await authService.logout();
   // User data is cleared
   ```

## User Model Properties

```dart
class User {
  final String id;
  final String fullName;  // ← Used for name
  final String email;
  final String? phoneNumber;
  final String role;
  final bool emailVerified;
}
```

## Files Modified

1. `flutter/lib/services/auth_service.dart`
   - Added user persistence methods
   - Updated login/register/logout

2. `flutter/lib/presentation/booking_checkout/booking_checkout.dart`
   - Fixed property name from `user.name` to `user.fullName`
   - Added phone number pre-fill

## Status

✅ **Fixed** - All diagnostics passing
✅ **Tested** - Methods available and working
✅ **Complete** - Ready to use

The booking checkout will now properly pre-fill guest information from the logged-in user!
