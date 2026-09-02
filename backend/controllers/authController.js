import User from '../models/User.model.js'
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import 'dotenv/config'
import { mailSender } from '../utils/mailSender.js';
import Otp from '../models/otp.js'
import { otpMailExistedUser, otpMailNewUser } from '../utils/templates/otpTemplate.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// GOOGLE LOGIN / SIGNUP (Combined)
export const googleLogin = async (req, res) => {
    const { idToken, user: customUser } = req.body;
    try {
        let email, name, sub;

        if (idToken) {
            const ticket = await client.verifyIdToken({
                idToken,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            email = payload.email;
            name = payload.name;
            sub = payload.sub;
        } else if (customUser?.email) {
            email = customUser.email;
            name = customUser.name;
            sub = customUser.sub || customUser.id;
        } else {
            return res.status(400).json({ success: false, msg: "Google token is required" });
        }

        let user = await User.findOne({ email });
        if (!user) {
            user = new User({ email, name: name || "User", googleId: sub });
            await user.save();
        } else if (!user.name && name) {
            user.name = name;
            await user.save();
        }

        const options = {
            maxAge: 259200000, // 3 days
            httpOnly: true,
            secure: true,
            sameSite: "None",
        };

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie("token", token, options).status(200).json({
            success: true,
            message: "Logged in successfully",
            token,
            user
        });
    } catch (error) {
        console.log('Error in google login', error.message);
        res.status(400).json({ success: false, msg: "Google login failed" });
    }
};

// EMAIL MAGIC LINK / OTP (Passwordless Signup/Login)
export const emailAuth = async (req, res) => {
    const { email } = req.body;
    try {

        //generate otp

        const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
        const otpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

        const isUserExisted = await User.findOne({ email })


        //make otp entry in db
        await Otp.create({
            otp,
            otpExpires: otpExpires,
        });

        // Mail send
        if (isUserExisted) {
            await mailSender(email, "Login to RESUME.AI", otpMailExistedUser(email, otp))
        } else {
            await mailSender(email, "Login to RESUME.AI", otpMailNewUser(email, otp))
        }

     
        console.log(`OTP for ${email}: ${otp}`);

        res.status(200).json({ msg: "OTP sent successfully" });
    } catch (error) {
        console.log('Error in email auth', error.message);
        res.status(500).json({ msg: "Auth failed" });
    }
};

export const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    if (!otp) {
        return res.status(400).json({
            success: false,
            message: "otp is required",
        });
    }
    try {
        const userOtp = await Otp.findOne({ otp: otp });

        if (!userOtp) {
            return res.status(400).json({
                success: false,
                message: "Invalid otp",
            });
        }

        // Check if OTP matches and is not expired
        if (userOtp.otpExpires < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "This otp is expired",
            });
        }


        let user = await User.findOne({ email });
        if (!user) {
            user = new User({ email });
            await user.save();
        }

        // OTP is valid, clear OTP fields and activate user
        await Otp.findOneAndDelete({ otp }, { new: true });

        //creat token
        const payload = {
            id: user._id,
            role: user.role,

        };

        const token = await jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "3d",
        });

        //send response
        const options = {
            // expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            maxAge: 259200000, // expired in 3 days
            httpOnly: true,
            secure: true,
            sameSite: "None",
        };

        res.cookie("token", token, options).status(200).json({
            success: true,
            message: "Loged in successfully",
            token,
            user,
        });



    } catch (error) {
        console.log('Error in verify otp', error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

export const handleLogOut = async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({
            success: true,
            message: "Loged out successfully",
        });
    } catch (error) {
        console.log('Error in logout', error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}