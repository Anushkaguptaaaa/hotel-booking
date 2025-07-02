# Stripe Webhook Setup and Testing Guide

## Overview
This guide explains how to set up and test the Stripe webhook functionality for marking hotel bookings as paid after successful payment.

## What Was Fixed

### 1. Enhanced Webhook Handler (`stripeWebhooks.js`)
- Added proper error handling and logging
- Support for both `checkout.session.completed` and `payment_intent.succeeded` events
- Better validation of booking updates
- Improved metadata handling

### 2. Server Configuration (`server.js`)
- Added webhook route: `POST /api/stripe/webhook`
- Configured raw body parsing for Stripe webhooks (required for signature verification)
- Proper middleware ordering (webhook route before JSON parsing)

### 3. Payment Flow
1. User clicks "Pay Now" button in My Bookings
2. `stripePayment` function creates Stripe checkout session with booking metadata
3. User completes payment on Stripe
4. Stripe sends webhook to `/api/stripe/webhook`
5. Webhook handler updates booking: `isPaid: true`, `status: "confirmed"`
6. Frontend shows "Paid" status with green indicator

## Setup Instructions

### 1. Environment Variables
Ensure these are set in your `.env` file:
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 2. Stripe Dashboard Configuration
1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://yourdomain.com/api/stripe/webhook`
3. Select events: `checkout.session.completed` and `payment_intent.succeeded`
4. Copy the webhook secret to your environment

### 3. Local Development Testing
For local testing, use Stripe CLI:
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to your Stripe account
stripe login

# Forward events to local server
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

### 4. Testing the Webhook

#### Option 1: Use Stripe CLI (Recommended)
```bash
# Trigger a test webhook
stripe trigger checkout.session.completed
```

#### Option 2: Manual Testing
1. Create a booking in your application
2. Note the booking ID from the database
3. Use the provided test script (`test-webhook.js`)
4. Update the booking ID in the script
5. Run the test

## Webhook Events Handled

### `checkout.session.completed`
- Triggered when a Stripe Checkout session is completed
- Updates booking with payment confirmation

### `payment_intent.succeeded`
- Triggered when payment is successfully processed
- Backup event handler for payment confirmation

## Database Updates
When webhook is processed successfully:
- `isPaid`: `false` → `true`
- `paymentMethod`: `"Pay At Hotel"` → `"Stripe"`
- `status`: `"pending"` → `"confirmed"`

## Troubleshooting

### Common Issues:
1. **Webhook signature verification fails**
   - Check `STRIPE_WEBHOOK_SECRET` is correct
   - Ensure raw body is being sent to webhook

2. **Booking not found**
   - Verify booking ID is correctly passed in session metadata
   - Check booking exists in database

3. **Webhook not triggered**
   - Verify webhook URL is accessible
   - Check Stripe dashboard for failed webhook attempts

### Debugging:
- Check server logs for webhook processing messages
- Use Stripe Dashboard → Events to see webhook delivery status
- Verify environment variables are loaded correctly

## Security Considerations
- Webhook signature verification prevents unauthorized requests
- Only process events from verified Stripe sources
- Validate booking ownership and status before updates

## Frontend Integration
The My Bookings page (`MyBookings.jsx`) already includes:
- Payment status indicators (green for paid, red for unpaid)
- "Pay Now" button for unpaid bookings
- Real-time status updates after payment

## Testing Checklist
- [ ] Environment variables configured
- [ ] Webhook endpoint responds correctly
- [ ] Booking status updates after payment
- [ ] Frontend shows correct payment status
- [ ] Email confirmations sent (if configured)
- [ ] Error handling works for invalid webhooks
