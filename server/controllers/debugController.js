import User from "../models/User.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

// Debug endpoint to check current user state
export const debugUserState = async (req, res) => {
  try {
    console.log("=== DEBUG USER STATE ===");
    console.log("User from middleware:", req.user);
    
    if (!req.user) {
      return res.json({ 
        success: false, 
        message: "No user found in request",
        debug: {
          headers: req.headers.authorization,
          user: null
        }
      });
    }

    const userId = req.user._id;
    console.log("Looking for hotels with owner ID:", userId);

    // Find all hotels for debugging
    const allHotels = await Hotel.find({}).populate('owner');
    console.log("All hotels in database:");
    allHotels.forEach(hotel => {
      console.log(`Hotel: ${hotel.name}, Owner ID: ${hotel.owner._id}, Owner Email: ${hotel.owner.email}`);
    });

    // Find this user's hotel
    const userHotel = await Hotel.findOne({ owner: userId }).populate('owner');
    console.log("User's hotel:", userHotel ? userHotel.name : "None found");

    // Find this user's rooms
    let userRooms = [];
    if (userHotel) {
      userRooms = await Room.find({ hotel: userHotel._id });
    }

    res.json({
      success: true,
      debug: {
        user: {
          id: req.user._id,
          email: req.user.email,
          username: req.user.username
        },
        hotel: userHotel ? {
          id: userHotel._id,
          name: userHotel.name,
          owner: userHotel.owner._id
        } : null,
        rooms: userRooms.length,
        allHotelsCount: allHotels.length
      }
    });
  } catch (error) {
    console.error("Debug error:", error);
    res.json({ success: false, message: error.message });
  }
};
