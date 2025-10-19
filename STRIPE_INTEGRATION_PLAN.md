# Stripe Payment Integration Plan

## Overview
Integrate Stripe payment processing for real hotel bookings in the e-commerce course project.

## Architecture

```
Flutter App                Backend API              Stripe API
    |                          |                        |
    |-- Create Booking ------->|                        |
    |                          |-- Create Payment ----->|
    |                          |    Intent              |
    |<-- Return Client --------|<----- Return ---------|
    |    Secret                |       Intent           |
    |                          |                        |
    |-- Confirm Payment -------|----------------------->|
    |    with Card             |                        |
    |                          |                        |
    |<-- Payment Success ------|<----- Webhook ---------|
    |                          |    (Async)             |
    |                          |                        |
    |-- Complete Booking ----->|                        |
    |<-- Booking Confirmed ----|                        |
```

## Implementation Steps

### Phase 1: Backend Setup

#### 1.1 Add Stripe Dependency
Add to `backend/pom.xml`:
```xml
<dependency>
    <groupId>com.stripe</groupId>
    <artifactId>stripe-java</artifactId>
    <version>24.0.0</version>
</dependency>
```

#### 1.2 Configuration
Add to `application.yml`:
```yaml
stripe:
  api-key: ${STRIPE_SECRET_KEY:sk_test_your_key_here}
  webhook-secret: ${STRIPE_WEBHOOK_SECRET:whsec_your_secret_here}
```

#### 1.3 Create Payment Service
- `PaymentService.java` - Handle Stripe operations
- `PaymentController.java` - REST endpoints
- `WebhookController.java` - Handle Stripe webhooks

#### 1.4 Update Booking Flow
- Add payment status to Booking entity
- Create PaymentIntent before booking
- Confirm booking after successful payment

### Phase 2: Flutter Setup

#### 2.1 Add Dependencies
Add to `flutter/pubspec.yaml`:
```yaml
dependencies:
  flutter_stripe: ^10.1.0
```

#### 2.2 Initialize Stripe
- Add publishable key
- Initialize in main.dart

#### 2.3 Create Payment Service
- `payment_service.dart` - Handle Stripe operations
- Create PaymentIntent
- Confirm payment
- Handle results

#### 2.4 Update Checkout UI
- Replace mock payment with real Stripe UI
- Add card input form
- Show payment processing
- Handle success/failure

### Phase 3: Security & Testing

#### 3.1 Security
- Never expose secret key in frontend
- Use HTTPS in production
- Validate webhook signatures
- Implement idempotency

#### 3.2 Testing
- Use Stripe test cards
- Test success scenarios
- Test failure scenarios
- Test webhook delivery

## Stripe Test Cards

```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
3D Secure: 4000 0025 0000 3155
Insufficient Funds: 4000 0000 0000 9995
```

## API Endpoints to Create

### Backend:
```
POST /api/v1/payments/create-intent
  - Create PaymentIntent
  - Return client secret

POST /api/v1/payments/confirm
  - Confirm payment status
  - Update booking

POST /api/v1/webhooks/stripe
  - Handle Stripe events
  - Update payment status
```

## Data Models

### Payment Entity
```java
@Entity
public class Payment {
    private String id;
    private String bookingId;
    private String stripePaymentIntentId;
    private Double amount;
    private String currency;
    private String status; // pending, succeeded, failed
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

### Payment Request DTO
```java
public class PaymentIntentRequest {
    private String bookingId;
    private Double amount;
    private String currency;
    private Map<String, String> metadata;
}
```

## Environment Variables Needed

### Backend (.env or application.yml):
```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Flutter (lib/config/stripe_config.dart):
```dart
const String stripePublishableKey = 'pk_test_...';
```

## Implementation Checklist

### Backend:
- [ ] Add Stripe dependency
- [ ] Create Payment entity
- [ ] Create PaymentService
- [ ] Create PaymentController
- [ ] Create WebhookController
- [ ] Update BookingService
- [ ] Add payment status to Booking
- [ ] Configure Stripe API key
- [ ] Test payment creation
- [ ] Test webhook handling

### Flutter:
- [ ] Add flutter_stripe dependency
- [ ] Initialize Stripe
- [ ] Create PaymentService
- [ ] Update checkout UI
- [ ] Add card input form
- [ ] Handle payment confirmation
- [ ] Show loading states
- [ ] Handle errors
- [ ] Test with test cards
- [ ] Update success flow

### Testing:
- [ ] Test successful payment
- [ ] Test declined card
- [ ] Test 3D Secure
- [ ] Test insufficient funds
- [ ] Test network errors
- [ ] Test webhook delivery
- [ ] Verify booking creation
- [ ] Verify payment records

## Cost Considerations

### Stripe Fees (Test mode is free):
- **Test Mode**: Free, unlimited transactions
- **Production**: 2.9% + $0.30 per successful charge

### For Course Project:
- Use **Test Mode** only
- No real money involved
- Perfect for demonstration
- All features available

## Next Steps

1. **You provide**:
   - Stripe Publishable Key (pk_test_...)
   - Stripe Secret Key (sk_test_...)

2. **I will implement**:
   - Complete backend integration
   - Complete Flutter integration
   - Testing guide
   - Documentation

3. **You test**:
   - Follow testing guide
   - Use test cards
   - Verify booking flow
   - Demo to professor

## Benefits for E-commerce Course

✅ **Real payment processing** - Not just a mock
✅ **Industry standard** - Stripe is used by major companies
✅ **Secure** - PCI compliant out of the box
✅ **Professional** - Production-ready implementation
✅ **Testable** - Complete test mode with test cards
✅ **Demonstrable** - Can show real payment flow
✅ **Learning** - Understand payment gateway integration

## Timeline

- **Setup**: 30 minutes (get Stripe keys)
- **Backend Implementation**: 2-3 hours
- **Flutter Implementation**: 2-3 hours
- **Testing**: 1 hour
- **Total**: ~6-7 hours

## Ready to Start?

Once you provide the Stripe API keys, I'll:
1. Implement complete backend payment processing
2. Integrate Stripe in Flutter app
3. Update booking flow
4. Create testing guide
5. Provide demo script for professor

Let me know when you have the keys and we'll get started! 🚀
