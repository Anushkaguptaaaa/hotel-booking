import express from 'express';
import "dotenv/config";
import cors from 'cors';
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from './controllers/clerkWebhooks.js';
import userRouter from './routes/userRoutes.js';
import hotelRouter from './routes/hotelRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import roomRouter from './routes/roomRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
import { debugUserState } from './controllers/debugController.js';
import { protect as authMiddleware } from './middleware/authMiddleware.js';
import { stripeWebhooks } from './controllers/stripeWebhooks.js';

connectDB()
connectCloudinary();

const app = express();
app.use(cors());

// Stripe webhook endpoint (must be before express.json() middleware)
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), stripeWebhooks);

//middleware
app.use(express.json());
app.use(clerkMiddleware());

//API TO LISTEN FOR CLERK WEBHOOKS
app.use("/api/clerk",clerkWebhooks)

app.get("/", (req, res) => res.send("API is working fine"));
app.use('/api/user', userRouter)
app.use('/api/hotels', hotelRouter)
app.use('/api/rooms', roomRouter)
app.use('/api/bookings', bookingRouter)

// Debug endpoint
app.get('/api/debug/user-state', authMiddleware, debugUserState)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));