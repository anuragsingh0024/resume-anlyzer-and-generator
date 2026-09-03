import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'
import { connectDB } from './config/db.js';
import authRoute from './routes/authRoute.js';
import resumeRoute from './routes/resumeRoute.js'
dotenv.config();
import fileUpload from "express-fileupload";
import cloudinaryConnect from './config/cloudinaryConfig.js';
import userRoute from './routes/userRoute.js'
import adminRoute from './routes/adminRoute.js'

const app = express();
const PORT = process.env.PORT || 5000;


//db connection
connectDB()

// CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5174",
  "https://resume-anlyzer-and-generator.vercel.app",
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
      return callback(null, true);
    }
    return callback(null, true); // fallback allow for production reliability
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"]
}));

app.use(express.json());
app.use(cookieParser());

//file upload
cloudinaryConnect();
app.use(fileUpload({
  useTempFiles: true
}));
// Routes (API v1 & Direct fallback)
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Auth routes
app.use('/api/v1/auth', authRoute);
app.use('/auth', authRoute);

// Resume routes
app.use('/api/v1/resume', resumeRoute);
app.use('/resume', resumeRoute);

// User routes
app.use('/api/v1/user', userRoute);
app.use('/user', userRoute);

// Admin routes
app.use('/api/v1/admin', adminRoute);
app.use('/admin', adminRoute);




app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
