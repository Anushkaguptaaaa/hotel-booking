#!/bin/bash

# Stripe Webhook Testing Setup Script

echo "🚀 Setting up Stripe Webhook Testing Environment"
echo "================================================"

# Check if .env exists
if [ ! -f "server/.env" ]; then
    echo "❌ Error: server/.env file not found"
    echo "Please create server/.env with:"
    echo "STRIPE_SECRET_KEY=sk_test_..."
    echo "STRIPE_WEBHOOK_SECRET=whsec_..."
    exit 1
fi

# Check if Stripe CLI is installed
if ! command -v stripe &> /dev/null; then
    echo "❌ Stripe CLI not found. Installing..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        brew install stripe/stripe-cli/stripe
    else
        echo "Please install Stripe CLI manually: https://stripe.com/docs/stripe-cli"
        exit 1
    fi
fi

echo "✅ Stripe CLI is available"

# Start the server in background
echo "🔄 Starting the server..."
cd server
npm run server &
SERVER_PID=$!
cd ..

# Wait for server to start
sleep 3

# Check if server is running
if curl -s http://localhost:3000/ > /dev/null; then
    echo "✅ Server is running on port 3000"
else
    echo "❌ Server failed to start"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

echo ""
echo "🎯 Ready for webhook testing!"
echo ""
echo "Option 1 - Test with Stripe CLI:"
echo "stripe listen --forward-to localhost:3000/api/stripe/webhook"
echo ""
echo "Option 2 - Trigger test webhook:"
echo "stripe trigger checkout.session.completed"
echo ""
echo "Option 3 - Manual testing:"
echo "1. Create a booking in your app"
echo "2. Click 'Pay Now' to test the full flow"
echo ""
echo "Press Ctrl+C to stop the server"

# Keep script running
wait $SERVER_PID
