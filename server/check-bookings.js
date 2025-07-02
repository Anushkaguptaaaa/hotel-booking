import mongoose from "mongoose";
import Booking from "./models/Booking.js";
import User from "./models/User.js";
import Room from "./models/Room.js";
import Hotel from "./models/Hotel.js";
import dotenv from "dotenv";

dotenv.config();

const checkBookings = async () => {
  try {
    console.log("Connecting to database...");
    await mongoose.connect(`${process.env.MONGODB_URI}/hotel-booking`);
    console.log("Database connected successfully");

    console.log("\n=== ALL BOOKINGS ===");
    const bookings = await Booking.find({}).populate('user room hotel');
    
    if (bookings.length === 0) {
      console.log("No bookings found in database");
    } else {
      bookings.forEach((booking, index) => {
        console.log(`\n--- Booking ${index + 1} ---`);
        console.log(`ID: ${booking._id}`);
        console.log(`Hotel: ${booking.hotel.name}`);
        console.log(`Room: ${booking.room.roomType}`);
        console.log(`Total Price: $${booking.totalPrice}`);
        console.log(`Payment Status: ${booking.isPaid ? 'PAID' : 'UNPAID'}`);
        console.log(`Payment Method: ${booking.paymentMethod}`);
        console.log(`Booking Status: ${booking.status}`);
        console.log(`Check-in: ${booking.checkInDate}`);
        console.log(`Check-out: ${booking.checkOutDate}`);
        console.log(`Created: ${booking.createdAt}`);
      });

      console.log(`\nTotal Bookings: ${bookings.length}`);
      const paidBookings = bookings.filter(b => b.isPaid);
      const unpaidBookings = bookings.filter(b => !b.isPaid);
      console.log(`Paid Bookings: ${paidBookings.length}`);
      console.log(`Unpaid Bookings: ${unpaidBookings.length}`);
    }

    await mongoose.disconnect();
    console.log("\nDatabase disconnected");
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

checkBookings();
