import stripe from "stripe";
import Booking from "../models/Booking.js";

// API to handle Stripe Webhooks
// POST /api/stripe/webhook
export const stripeWebhooks = async (request, response) => {
  try {
    // Stripe Gateway Initialize
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripeInstance.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log("Received webhook event:", event.type);
    console.log("Event data:", JSON.stringify(event.data.object, null, 2));

    // Handle the event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      console.log("Session metadata:", session.metadata);
      const { bookingId } = session.metadata;

      if (bookingId) {
        console.log(`Processing payment for booking ID: ${bookingId}`);
        
        // Check if booking exists first
        const existingBooking = await Booking.findById(bookingId);
        if (!existingBooking) {
          console.error(`Booking ${bookingId} not found in database`);
          return response.status(404).json({ error: "Booking not found" });
        }

        console.log("Existing booking status:", {
          id: existingBooking._id,
          isPaid: existingBooking.isPaid,
          status: existingBooking.status,
          paymentMethod: existingBooking.paymentMethod
        });

        // Mark Payment as Paid
        const updatedBooking = await Booking.findByIdAndUpdate(
          bookingId, 
          { 
            isPaid: true, 
            paymentMethod: "Stripe",
            status: "confirmed"
          },
          { new: true }
        );

        if (updatedBooking) {
          console.log(`✅ Booking ${bookingId} marked as paid successfully!`);
          console.log("Updated booking status:", {
            id: updatedBooking._id,
            isPaid: updatedBooking.isPaid,
            status: updatedBooking.status,
            paymentMethod: updatedBooking.paymentMethod
          });
        } else {
          console.error(`❌ Failed to update booking ${bookingId}`);
        }
      } else {
        console.error("❌ No bookingId found in session metadata");
        console.log("Available metadata keys:", Object.keys(session.metadata || {}));
      }
    } else if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;
      console.log(`Processing payment_intent.succeeded for: ${paymentIntentId}`);

      try {
        // Getting Session Metadata
        const sessions = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntentId,
        });

        console.log(`Found ${sessions.data.length} sessions for payment intent`);

        if (sessions.data && sessions.data.length > 0) {
          const session = sessions.data[0];
          console.log("Session metadata:", session.metadata);
          const { bookingId } = session.metadata;

          if (bookingId) {
            console.log(`Processing payment for booking ID: ${bookingId}`);
            
            // Check if booking exists first
            const existingBooking = await Booking.findById(bookingId);
            if (!existingBooking) {
              console.error(`Booking ${bookingId} not found in database`);
              return response.status(404).json({ error: "Booking not found" });
            }

            console.log("Existing booking status:", {
              id: existingBooking._id,
              isPaid: existingBooking.isPaid,
              status: existingBooking.status,
              paymentMethod: existingBooking.paymentMethod
            });

            // Mark Payment as Paid
            const updatedBooking = await Booking.findByIdAndUpdate(
              bookingId, 
              { 
                isPaid: true, 
                paymentMethod: "Stripe",
                status: "confirmed"
              },
              { new: true }
            );

            if (updatedBooking) {
              console.log(`✅ Booking ${bookingId} marked as paid successfully via payment_intent!`);
              console.log("Updated booking status:", {
                id: updatedBooking._id,
                isPaid: updatedBooking.isPaid,
                status: updatedBooking.status,
                paymentMethod: updatedBooking.paymentMethod
              });
            } else {
              console.error(`❌ Failed to update booking ${bookingId}`);
            }
          } else {
            console.error("❌ No bookingId found in session metadata");
            console.log("Available metadata keys:", Object.keys(session.metadata || {}));
          }
        } else {
          console.error("❌ No sessions found for payment intent");
        }
      } catch (sessionError) {
        console.error("❌ Error retrieving session:", sessionError.message);
      }
    } else {
      console.log("Unhandled event type:", event.type);
    }

    response.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error.message);
    response.status(500).json({ error: "Internal server error" });
  }
};
