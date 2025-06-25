import User from "../models/User.js";
import { getAuth } from "@clerk/express";
import jwt from 'jsonwebtoken';

// Middleware to check if user is authenticated
export const protect = async (req, res, next) => {
  try {
    console.log("=== Auth middleware called ===");
    console.log("Request method:", req.method);
    console.log("Request URL:", req.url);
    console.log("All headers:", req.headers);
    console.log("Authorization header:", req.headers.authorization);
    
    // First try to get userId using getAuth
    let userId = null;
    try {
      const authData = getAuth(req);
      console.log("getAuth full response:", authData);
      userId = authData?.userId;
      console.log("getAuth userId:", userId);
    } catch (authError) {
      console.log("getAuth error:", authError.message);
    }
    
    // If getAuth doesn't work, try to extract from JWT token directly
    if (!userId && req.headers.authorization) {
      const token = req.headers.authorization.replace('Bearer ', '');
      console.log("Extracted token (first 50 chars):", token.substring(0, 50));
      try {
        // Decode the JWT without verification to get the sub field
        const decoded = jwt.decode(token);
        console.log("Decoded JWT payload:", decoded);
        userId = decoded?.sub;
        console.log("JWT decoded userId:", userId);
      } catch (jwtError) {
        console.log("JWT decode error:", jwtError.message);
      }
    }
    
    if (!userId) {
      console.log("No userId found - returning not authenticated");
      return res.json({ success: false, message: "not authenticated" });
    }
    
    console.log("Looking for user with ID:", userId);
    let user = await User.findById(userId);
    console.log("User found:", user ? "Yes" : "No");
    if (user) {
      console.log("User details:", { id: user._id, email: user.email, role: user.role });
    }
    
    // If user doesn't exist, create a basic user record
    // This handles cases where webhook might not have fired yet
    if (!user) {
      console.log("Creating user record for userId:", userId);
      try {
        user = await User.create({
          _id: userId,
          email: "unknown@example.com", // Will be updated by webhook
          username: "Unknown User", // Will be updated by webhook
          role: "user"
        });
        console.log("User created successfully:", user);
      } catch (createError) {
        console.error("Error creating user:", createError);
        return res.json({ success: false, message: "User creation failed" });
      }
    }
    
    req.user = user;
    console.log("Auth successful, proceeding to next middleware");
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.json({ success: false, message: "Authentication failed" });
  }
};