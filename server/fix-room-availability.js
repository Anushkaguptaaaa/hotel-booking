import mongoose from "mongoose";
import Room from "./models/Room.js";
import dotenv from "dotenv";

dotenv.config();

const fixRoomAvailability = async () => {
  try {
    console.log("Connecting to database...");
    await mongoose.connect(`${process.env.MONGODB_URI}/hotel-booking`);
    console.log("Database connected successfully");

    // Update the room to be available
    const roomId = "685c490e33434ad1969ac72a";
    const result = await Room.findByIdAndUpdate(
      roomId, 
      { isAvailable: true }, 
      { new: true }
    );
    
    if (result) {
      console.log(`Room ${result.roomType} is now available!`);
    } else {
      console.log("Room not found!");
    }

    await mongoose.disconnect();
    console.log("Database disconnected");
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

fixRoomAvailability();
