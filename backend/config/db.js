import mongoose from 'mongoose';
import dotenv from 'dotenv/config';



export const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.log('No MONGO_URI provided in .env, skipping database connection');
            return;
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(`MongoDB connection error: ${err.message}`);
    }
};