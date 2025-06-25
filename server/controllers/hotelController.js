import Hotel from "../models/Hotel.js";
import User from "../models/User.js";
import Room from "../models/Room.js";
import Booking from "../models/Booking.js";

// API to create a new hotel
// POST /api/hotels
export const registerHotel = async (req, res) => {
  try {

    const { name, address, contact, city } = req.body;
    const owner = req.user._id;

    // Check if User Already Registered
    const hotel = await Hotel.findOne({ owner });
    if (hotel) {
      return res.json({ success: false, message: "Hotel Already Registered" });
    }

    await Hotel.create({ name, address, contact, city, owner });

    // Update User Role
    await User.findByIdAndUpdate(owner, { role: "hotelOwner" });

    res.json({ success: true, message: "Hotel Registered Successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API to get hotel owner dashboard data
// GET /api/hotels/dashboard
export const getDashboardData = async (req, res) => {
  try {
    console.log("=== Dashboard API called ===");
    console.log("User ID:", req.user._id);
    console.log("User role:", req.user.role);
    const owner = req.user._id;

    // Find the hotel owned by this user
    const hotel = await Hotel.findOne({ owner });
    console.log("Hotel found for this user:", hotel ? "Yes" : "No");
    
    if (!hotel) {
      console.log("No hotel found for owner:", owner);
      return res.json({ 
        success: false, 
        message: "No hotel registered for your account. Please register a hotel first.",
        needsHotelRegistration: true
      });
    }

    // Get all rooms for this hotel
    const rooms = await Room.find({ hotel: hotel._id });
    console.log("Rooms found:", rooms.length);
    const roomIds = rooms.map(room => room._id);

    // Get all bookings for this hotel's rooms
    const bookings = await Booking.find({ room: { $in: roomIds } })
      .populate('user', 'username email')
      .populate('room', 'roomType')
      .sort({ createdAt: -1 })
      .limit(10); // Get latest 10 bookings
    console.log("Bookings found:", bookings.length);

    // Calculate total bookings and revenue
    const totalBookings = await Booking.countDocuments({ room: { $in: roomIds } });
    const totalRevenueResult = await Booking.aggregate([
      { $match: { room: { $in: roomIds }, isPaid: true } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);
    const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].total : 0;

    console.log("Dashboard data:", {
      totalBookings,
      totalRevenue,
      totalRooms: rooms.length
    });

    res.json({
      success: true,
      data: {
        hotel,
        totalBookings,
        totalRevenue,
        recentBookings: bookings,
        totalRooms: rooms.length
      }
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};