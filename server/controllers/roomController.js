import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import { v2 as cloudinary } from "cloudinary";

// API to create a new room for a hotel
// POST /api/rooms
export const createRoom = async (req, res) => {
  try {
    console.log("=== Create room API called ===");
    console.log("User object:", req.user);
    console.log("User ID from req.user._id:", req.user._id);
    console.log("User role:", req.user.role);
    
    const { roomType, pricePerNight, amenities } = req.body;

    // Check all hotels first
    const allHotels = await Hotel.find({});
    console.log("All hotels in database:");
    allHotels.forEach(hotel => {
      console.log(`Hotel: ${hotel.name}, Owner: ${hotel.owner}`);
    });

    const hotel = await Hotel.findOne({ owner: req.user._id });
    console.log("Hotel found for user:", hotel ? "Yes" : "No");
    
    if (hotel) {
      console.log("Found hotel:", hotel.name);
    } else {
      console.log("No hotel found for owner:", req.user._id);
      // Let's see if there's a hotel for this user with string comparison
      const hotelByString = await Hotel.findOne({ owner: req.user._id.toString() });
      console.log("Hotel found with string conversion:", hotelByString ? "Yes" : "No");
    }

    if (!hotel) {
      return res.json({ success: false, message: "No Hotel found for your account. Please register a hotel first." });
    }

    // upload images to cloudinary
    const uploadImages = req.files.map(async (file) => {
      const response = await cloudinary.uploader.upload(file.path);
      return response.secure_url;
    });

    // Wait for all uploads to complete
    const images = await Promise.all(uploadImages);

    await Room.create({
      hotel: hotel._id,
      roomType,
      pricePerNight: +pricePerNight,
      amenities: JSON.parse(amenities),
      images,
    });

    res.json({ success: true, message: "Room created successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API to get all rooms
// GET /api/rooms
export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ isAvailable: true })
      .populate({
        path: 'hotel',
        populate: {
          path: 'owner', 
          select: 'image',
        },
      }).sort({ createdAt: -1 });
    res.json({ success: true, rooms });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API to get all rooms for a specific hotel
// GET /api/rooms/owner
export const getOwnerRooms = async (req, res) => {
  try {
    const hotelData = await Hotel.findOne({ owner: req.user._id });
    const rooms = await Room.find({ hotel: hotelData._id.toString() }).populate("hotel");
    res.json({ success: true, rooms });
  } catch (error) {
    console.log(error);
    
    res.json({ success: false, message: error.message });
  }
};

// API to toggle availability of a room
// POST /api/rooms/toggle-availability
export const toggleRoomAvailability = async (req, res) => {
  try {
    const { roomId } = req.body;
    const roomData = await Room.findById(roomId);
    roomData.isAvailable = !roomData.isAvailable;
    await roomData.save();
    res.json({ success: true, message: "Room availability Updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};