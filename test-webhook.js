// Test script to verify webhook functionality
// This script simulates a Stripe webhook call to test the payment processing

import fetch from 'node-fetch';

const testWebhook = async () => {
  // Sample webhook payload for checkout.session.completed event
  const webhookPayload = {
    id: 'evt_test_webhook',
    object: 'event',
    api_version: '2020-08-27',
    created: Math.floor(Date.now() / 1000),
    data: {
      object: {
        id: 'cs_test_session_id',
        object: 'checkout.session',
        payment_status: 'paid',
        metadata: {
          bookingId: 'your_booking_id_here' // Replace with actual booking ID for testing
        }
      }
    },
    type: 'checkout.session.completed'
  };

  try {
    console.log('Testing webhook endpoint...');
    console.log('Note: This is a basic test without proper Stripe signature verification');
    console.log('Payload:', JSON.stringify(webhookPayload, null, 2));
    
    // This would normally include proper Stripe signature headers
    const response = await fetch('http://localhost:3000/api/stripe/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': 'test_signature' // This would be a real signature in production
      },
      body: JSON.stringify(webhookPayload)
    });

    const result = await response.text();
    console.log('Response status:', response.status);
    console.log('Response:', result);

  } catch (error) {
    console.error('Error testing webhook:', error.message);
  }
};

// Uncomment the line below to run the test (make sure server is running)
// testWebhook();

console.log('Webhook test script ready. To test:');
console.log('1. Make sure your server is running on port 3000');
console.log('2. Replace "your_booking_id_here" with an actual booking ID from your database');
console.log('3. Uncomment the testWebhook() call at the bottom');
console.log('4. Run: node test-webhook.js');
