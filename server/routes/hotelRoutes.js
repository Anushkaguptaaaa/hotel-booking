import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { registerHotel, getDashboardData } from "../controllers/hotelController.js";

const hotelRouter = express.Router();

hotelRouter.post("/", protect, registerHotel);
hotelRouter.get("/dashboard", protect, getDashboardData);

export default hotelRouter;
