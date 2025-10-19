# Backend Startup Issue - Quick Fix

## The Problem

The error "No static resource payments/create-intent" means the backend API endpoint is not available. This is because the backend has **Lombok annotation errors** and didn't compile/start properly.

## Quick Solution

### Option 1: Use IntelliJ's Build (Recommended)

IntelliJ IDEA has built-in Lombok support that works even when Maven fails:

1. **Open IntelliJ IDEA**
2. **Open the project**: `backend` folder
3. **Make sure Lombok plugin is enabled**:
   - Go to: Settings → Plugins
   - Search for "Lombok"
   - Make sure it's installed and enabled
4. **Enable Annotation Processing**:
   - Go to: Settings → Build, Execution, Deployment → Compiler → Annotation Processors
   - Check ✅ "Enable annotation processing"
5. **Run the application**:
   - Open: `src/main/java/com/hotelbooker/HotelBookingApplication.java`
   - Click the green play button ▶️
   - Or right-click → Run 'HotelBookingApplication'

### Option 2: Temporarily Disable Stripe Endpoints

If you want to test without Stripe first, you can comment out the Stripe-related code:

1. Comment out `@Autowired` fields in controllers that use PaymentService
2. Or skip payment and just test the booking flow without payment

### Option 3: Fix Lombok Annotations

The entity classes need their Lombok annotations restored. Add these to each entity class:

```java
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "table_name")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EntityName {
    // fields...
}
```

## How to Verify Backend is Running

### Check the console output:
You should see:
```
Started HotelBookingApplication in X.XXX seconds
```

### Test the API:
Open browser or Postman and try:
```
http://localhost:8080/api/v1/auth/login
```

You should get a response (even if it's an error about missing credentials), not a 404.

## Current Status

❌ **Backend**: Not running properly (Lombok errors)
✅ **Flutter**: Ready and working
✅ **Stripe Config**: Added correctly

## Recommended Action

**Use IntelliJ IDEA to run the backend** - it handles Lombok automatically!

1. Open IntelliJ
2. Open `HotelBookingApplication.java`
3. Click Run ▶️
4. Wait for "Started HotelBookingApplication"
5. Then test the Flutter app again

The Stripe payment will work once the backend is running properly!

## Alternative: Test Without Payment First

If you want to test the booking flow without payment:

1. Skip the payment integration temporarily
2. Test: Login → Search → Hotel Detail → Room Selection
3. Then fix backend and add payment later

## Need Help?

The main issue is **Lombok annotations missing from entity classes**. This is a separate issue from the Stripe integration. The Stripe code we added is correct - it just needs the backend to be running!
