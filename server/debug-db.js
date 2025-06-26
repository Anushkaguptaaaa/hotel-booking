import mongoose from "mongoose";
import Hotel from "./models/Hotel.js";
import Room from "./models/Room.js";
import User from "./models/User.js";
import dotenv from "dotenv";

dotenv.config();

const debugDatabase = async () => {
  try {
    console.log("Connecting to database...");
    await mongoose.connect(`${process.env.MONGODB_URI}/hotel-booking`);
    console.log("Database connected successfully");

    // Check all users
    console.log("\n=== ALL USERS ===");
    const users = await User.find({});
    users.forEach(user => {
      console.log(`User: ${user.email}, ID: ${user._id}, ClerkId: ${user.clerkId}`);
    });

    // Check all hotels
    console.log("\n=== ALL HOTELS ===");
    const hotels = await Hotel.find({}).populate('owner');
    hotels.forEach(hotel => {
      console.log(`Hotel: ${hotel.name}, Owner ID: ${hotel.owner._id}, Owner Email: ${hotel.owner.email}`);
    });

    // Check all rooms
    console.log("\n=== ALL ROOMS ===");
    const rooms = await Room.find({}).populate({
      path: 'hotel',
      populate: {
        path: 'owner'
      }
    });
    rooms.forEach(room => {
      console.log(`Room ID: ${room._id}, Room: ${room.roomType}, Hotel: ${room.hotel.name}, Owner: ${room.hotel.owner.email}, Available: ${room.isAvailable}`);
    });

    console.log(`\nTotal Users: ${users.length}`);
    console.log(`Total Hotels: ${hotels.length}`);
    console.log(`Total Rooms: ${rooms.length}`);

    await mongoose.disconnect();
    console.log("Database disconnected");
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

debugDatabase();
