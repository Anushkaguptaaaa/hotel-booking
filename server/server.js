import express from 'express';
import "dotenv/config";
import cors from 'cors';
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from './controllers/clerkWebhooks.js';
import userRouter from './routes/userRoutes.js';
import hotelRouter from './routes/hotelRoutes.js';

connectDB()

const app = express();
app.use(cors());
//middleware
app.use(express.json());
app.use(clerkMiddleware());
//API TO LISTEN FOR CLERK WEBHOOKS
app.use("/api/clerk",clerkWebhooks)

app.get("/", (req, res) => res.send("API is working fine"));
app.use('/api/user', userRouter)
app.use('/api/hotels', hotelRouter)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));