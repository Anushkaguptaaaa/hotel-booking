import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { get } from 'mongoose';
import { storeRecentSearchedCities } from '../controllers/userController';

const userRoutes = express.Router();

userRoutes.get('/', protect, getUserData);
userRoutes.post('/store-recent-search', protect, storeRecentSearchedCities);


export default userRouter;