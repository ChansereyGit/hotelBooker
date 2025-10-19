# Stripe Setup Guide - Quick Start

## Step 1: Create Stripe Account (5 minutes)

### 1.1 Sign Up
1. Go to: https://dashboard.stripe.com/register
2. Enter your email
3. Create a password
4. Verify your email

### 1.2 Skip Business Details (for testing)
- You can skip business verification for test mode
- Click "Skip for now" or "I'll do this later"

## Step 2: Get Your API Keys (2 minutes)

### 2.1 Access Dashboard
1. Go to: https://dashboard.stripe.com/test/apikeys
2. Make sure you're in **TEST MODE** (toggle in top right)

### 2.2 Copy Your Keys
You'll see two keys:

**Publishable Key** (Safe to share, used in Flutter):
```
pk_test_51Abc123...xyz
```

**Secret Key** (Keep private, used in Backend):
```
sk_test_51Abc123...xyz
```

Click "Reveal test key" to see the secret key.

## Step 3: What to Provide Me

Just send me these two keys (you can paste them here):

```
Publishable Key: pk_test_...
Secret Key: sk_test_...
```

**Note**: These are TEST keys, not real money involved!

## Step 4: Optional - Webhook Setup (I'll do this)

For webhook testing, we'll need:
1. Go to: https://dashboard.stripe.com/test/webhooks
2. Click "Add endpoint"
3. URL: `http://localhost:8080/api/v1/webhooks/stripe`
4. Events: Select "payment_intent.succeeded" and "payment_intent.payment_failed"
5. Copy the webhook signing secret (starts with `whsec_...`)

But we can do this later - not required for initial testing!

## What Happens Next?

Once you provide the keys, I will:

### Backend (Spring Boot):
1. ✅ Add Stripe Java SDK dependency
2. ✅ Create Payment entity and repository
3. ✅ Create PaymentService for Stripe operations
4. ✅ Create PaymentController with endpoints
5. ✅ Update BookingService to handle payments
6. ✅ Add webhook handler for payment events
7. ✅ Configure Stripe API key

### Flutter:
1. ✅ Add flutter_stripe package
2. ✅ Initialize Stripe with publishable key
3. ✅ Create PaymentService
4. ✅ Update checkout UI with real card input
5. ✅ Implement payment confirmation
6. ✅ Handle success/failure states
7. ✅ Update booking flow

### Documentation:
1. ✅ Testing guide with test cards
2. ✅ API documentation
3. ✅ Demo script for professor
4. ✅ Troubleshooting guide

## Test Cards I'll Provide

You'll be able to test with these cards:

| Card Number | Scenario |
|-------------|----------|
| 4242 4242 4242 4242 | Success |
| 4000 0000 0000 0002 | Card Declined |
| 4000 0025 0000 3155 | 3D Secure Required |
| 4000 0000 0000 9995 | Insufficient Funds |

**Expiry**: Any future date (e.g., 12/25)
**CVC**: Any 3 digits (e.g., 123)
**ZIP**: Any 5 digits (e.g., 12345)

## Security Notes

✅ **Test keys are safe** - No real money
✅ **Secret key stays in backend** - Never in Flutter
✅ **Publishable key is public** - Safe in Flutter
✅ **All transactions are test** - Can't charge real cards

## Quick FAQ

**Q: Do I need to add a bank account?**
A: No! Test mode works without any bank details.

**Q: Will this cost money?**
A: No! Test mode is completely free.

**Q: Can I use this for the course demo?**
A: Yes! Perfect for demonstrating real payment flow.

**Q: What if I don't have the keys yet?**
A: Just create the account (takes 5 min) and get the keys from the dashboard.

**Q: Is this production-ready?**
A: The code will be production-ready, but you'd need to:
- Activate your Stripe account
- Switch to live keys
- Use HTTPS
- Complete business verification

## Ready?

Just paste your two keys here:
```
Publishable Key: pk_test_...
Secret Key: sk_test_...
```

And I'll implement the complete Stripe integration! 🎉

## Alternative: Use My Test Keys (Temporary)

If you want to see it working first before creating your account, I can use placeholder keys for the initial implementation, and you can replace them later. But I recommend getting your own keys so you can:
- See transactions in your dashboard
- Test webhooks
- Have full control
- Show professor your own Stripe dashboard

Let me know how you'd like to proceed! 🚀
