# Stripe Payment - Quick Test Guide

## 🚀 Quick Start (5 Minutes)

### 1. Start Backend
```bash
cd backend
./mvnw spring-boot:run
```
✅ Wait for: "Started HotelBookerApplication"

### 2. Start Flutter
```bash
cd flutter
flutter pub get
flutter run
```
✅ App should launch on your device/emulator

### 3. Test Payment
1. Login with test user
2. Search for "New York"
3. Click any hotel
4. Click "Book Now"
5. Select a room
6. Fill guest info
7. Click "Complete Booking"
8. **Enter test card**: `4242 4242 4242 4242`
9. **Expiry**: `12/25`
10. **CVC**: `123`
11. Click "Pay"
12. ✅ See success dialog!

## 💳 Test Cards Cheat Sheet

### Success
```
Card: 4242 4242 4242 4242
Exp:  12/25
CVC:  123
ZIP:  12345
```

### Declined
```
Card: 4000 0000 0000 0002
Exp:  12/25
CVC:  123
ZIP:  12345
```

### 3D Secure (Extra Authentication)
```
Card: 4000 0025 0000 3155
Exp:  12/25
CVC:  123
ZIP:  12345
```

### Insufficient Funds
```
Card: 4000 0000 0000 9995
Exp:  12/25
CVC:  123
ZIP:  12345
```

## 🔍 Verify Payment

### In Database:
```sql
-- Check payment
SELECT * FROM payments ORDER BY created_at DESC LIMIT 1;

-- Check booking
SELECT * FROM bookings ORDER BY created_at DESC LIMIT 1;
```

### In Stripe Dashboard:
1. Go to: https://dashboard.stripe.com/test/payments
2. See your test payment
3. Click for details

## ❌ Common Issues

### "Payment failed"
- ✅ Check backend is running
- ✅ Check internet connection
- ✅ Try test card: 4242 4242 4242 4242

### "Network error"
- ✅ Backend must be running on localhost:8080
- ✅ Check firewall settings
- ✅ Restart backend

### Payment sheet doesn't appear
- ✅ Run `flutter pub get`
- ✅ Restart app
- ✅ Check Stripe is initialized in main.dart

## 📱 Demo for Professor

### 1. Show Complete Flow (2 min)
- Search → Select Hotel → Book Room → Pay → Success

### 2. Show Stripe Dashboard (1 min)
- Login to dashboard
- Show payment record
- Show transaction details

### 3. Show Database (1 min)
- Show payment table
- Show booking table
- Show payment status: SUCCEEDED

### 4. Test Failure (1 min)
- Use declined card: 4000 0000 0000 0002
- Show error handling
- Show user-friendly message

## ✅ Success Checklist

- [ ] Backend running
- [ ] Flutter app running
- [ ] Can login
- [ ] Can search hotels
- [ ] Can select hotel
- [ ] Can choose room
- [ ] Payment sheet appears
- [ ] Can enter card details
- [ ] Payment processes
- [ ] Success dialog shows
- [ ] Booking ID displayed
- [ ] Payment in database
- [ ] Booking in database
- [ ] Payment in Stripe dashboard

## 🎯 Key Points for Professor

1. **Real Payment Processing** - Not a simulation
2. **Industry Standard** - Uses Stripe (used by Uber, Shopify)
3. **Secure** - PCI compliant, no card data on server
4. **Production Ready** - Can go live with real keys
5. **Complete Integration** - Backend + Frontend + Database

## 📊 What to Show

### Technical Implementation:
- ✅ Spring Boot backend with Stripe SDK
- ✅ Flutter frontend with Stripe SDK
- ✅ REST API for payment operations
- ✅ Database persistence
- ✅ Webhook handling
- ✅ Error handling
- ✅ Security (JWT + PCI compliance)

### User Experience:
- ✅ Native payment UI
- ✅ Card scanning
- ✅ Loading states
- ✅ Error messages
- ✅ Success confirmation
- ✅ Booking reference

## 🎓 Course Relevance

### E-commerce Concepts Demonstrated:
1. **Payment Gateway Integration**
2. **Secure Transaction Processing**
3. **Order Management**
4. **Customer Data Handling**
5. **Error Handling**
6. **User Experience Design**
7. **API Integration**
8. **Database Design**
9. **Security Best Practices**
10. **Testing Strategies**

## 💡 Quick Tips

- **Always use test mode** for demos
- **Test cards never charge real money**
- **Stripe dashboard shows all test transactions**
- **Can test unlimited times for free**
- **Easy to switch to production later**

## 🚨 Emergency Fixes

### If payment fails:
```bash
# Restart backend
cd backend
./mvnw spring-boot:run

# Restart Flutter
flutter clean
flutter pub get
flutter run
```

### If Stripe not initialized:
Check `flutter/lib/main.dart` has:
```dart
Stripe.publishableKey = StripeConfig.publishableKey;
await Stripe.instance.applySettings();
```

### If backend error:
Check `application-dev.yml` has:
```yaml
stripe:
  api-key: "sk_test_..."
  publishable-key: "pk_test_..."
```

## 📞 Need Help?

1. **Check logs**: Backend console for errors
2. **Check Stripe Dashboard**: See payment attempts
3. **Check database**: Verify records created
4. **Try test card**: 4242 4242 4242 4242

## 🎉 You're Ready!

Everything is set up and ready to demo. Just follow the quick test steps above and you'll have a working payment system in minutes!

**Good luck with your presentation!** 🚀
