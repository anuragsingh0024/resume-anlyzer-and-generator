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

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser())

//file upload
cloudinaryConnect();
app.use(fileUpload({
  useTempFiles: true
}))


app.use(express.json())
// Routes (placeholder)
app.get('/', (req, res) => {
  res.send('API is running...');
});

//auth route
app.use('/api/v1/auth', authRoute)


//resume route
app.use('/api/v1/resume', resumeRoute)

//user route
app.use('/api/v1/user', userRoute)



//admin route
app.use('/api/v1/admin', adminRoute)




app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
