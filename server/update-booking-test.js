import "dotenv/config";
import mongoose from "mongoose";
import Booking from "./models/Booking.js";

const testBookingUpdate = async () => {
  try {
    // Connect with the exact same URI format as the app
    const mongoUri = `${process.env.MONGODB_URI?.trim()}/hotel-booking`;
    console.log("📡 Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB");

    // Get the most recent booking
    const booking = await Booking.findOne().sort({ createdAt: -1 });
    
    if (!booking) {
      console.log("❌ No bookings found");
      return;
    }

    console.log("\n📋 Found booking:");
    console.log(`ID: ${booking._id}`);
    console.log(`Hotel: ${booking.hotel}`);
    console.log(`Current Status: ${booking.isPaid ? "PAID" : "UNPAID"}`);
    console.log(`Payment Method: ${booking.paymentMethod}`);

    // Update to paid status
    booking.isPaid = true;
    booking.paymentMethod = "Stripe";
    booking.status = "confirmed";
    await booking.save();

    console.log("\n✅ Updated booking to PAID status");
    console.log("🔄 Refresh your frontend to see the change!");

  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("📡 Disconnected from MongoDB");
  }
};

testBookingUpdate();
