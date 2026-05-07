import express from 'express';
const router = express.Router();
import { googleLogin, emailAuth, verifyOtp, handleLogOut } from '../controllers/authController.js';

router.post('/google', googleLogin);
router.post('/email-auth', emailAuth);
router.post('/verify-otp', verifyOtp)

router.post('/logout', handleLogOut)

export default router;