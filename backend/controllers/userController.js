import mongoose from "mongoose";
import User from '../models/User.model.js'
import Resume from '../models/Resume.model.js'

export const getUser = async (req, res) => {
    try {
        const userId = req.user.id;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User id not found"
            })
        }

        const user = await User.findById(userId)
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User  not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "user fetched",
            user
        })
    } catch (err) {
        console.log('err while fetching user details: ', err.message)
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.body

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User id not found"
            })
        }

        const userIdObj = userId

        const user = await User.findByIdAndDelete(userIdObj)
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }

        await Resume.deleteMany({ userId: user._id })

        return res.status(200).json({
            success: true,
            message: "User deleted",
            user
        })

    } catch (err) {
        console.log('err while deleting user: ', err.message, err)
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
        if (!users) {
            return res.status(400).json({
                success: false,
                message: "Users not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Users fetched",
            users
        })
    } catch (err) {
        console.log('err while fetching users: ', err.message)
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

export const getCountOfResumesUser = async (req, res) => {
    try {
        const userId = req.user.id
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User id not found"
            })
        }
        const countOfResumes = await Resume.countDocuments({ userId: userId })
        if (!countOfResumes) {
            return res.status(400).json({
                success: false,
                message: "count of resumes not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "count of resumes fetched",
            countOfResumes
        })
    } catch (err) {
        console.log('err while fetching count of resumes: ', err.message)
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}