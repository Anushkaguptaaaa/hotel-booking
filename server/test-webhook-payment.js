import "dotenv/config";
import mongoose from "mongoose";
import Booking from "./models/Booking.js";

const BOOKING_ID = "68651bebcb7b3512b3a92804"; // Most recent booking

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Database connected");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
};

// Test webhook by manually updating a booking
const testWebhookEffect = async () => {
  try {
    console.log(`🧪 Testing webhook effect on booking: ${BOOKING_ID}`);
    
    // Check current status
    const beforeUpdate = await Booking.findById(BOOKING_ID);
    if (!beforeUpdate) {
      console.error("❌ Booking not found!");
      return;
    }
    
    console.log("\n📋 BEFORE UPDATE:");
    console.log(`Payment Status: ${beforeUpdate.isPaid ? "PAID" : "UNPAID"}`);
    console.log(`Payment Method: ${beforeUpdate.paymentMethod}`);
    console.log(`Booking Status: ${beforeUpdate.status}`);
    
    // Simulate what the webhook does
    const updatedBooking = await Booking.findByIdAndUpdate(
      BOOKING_ID,
      {
        isPaid: true,
        paymentMethod: "Stripe",
        status: "confirmed"
      },
      { new: true }
    );
    
    console.log("\n✅ AFTER UPDATE:");
    console.log(`Payment Status: ${updatedBooking.isPaid ? "PAID" : "UNPAID"}`);
    console.log(`Payment Method: ${updatedBooking.paymentMethod}`);
    console.log(`Booking Status: ${updatedBooking.status}`);
    
    console.log("\n🎉 Webhook simulation successful!");
    console.log("Now refresh your frontend to see the changes.");
    
  } catch (error) {
    console.error("❌ Error testing webhook:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("📡 Database disconnected");
  }
};

// Main execution
const main = async () => {
  await connectDB();
  await testWebhookEffect();
};

main();
