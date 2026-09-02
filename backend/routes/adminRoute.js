import express from 'express'
import { isAdmin, strictedAuth } from '../middlewares/strictedAuth.js'
import { deleteUser, getAllUsers } from '../controllers/userController.js'
import { getAdminStats, getCountOfResumeByUser } from '../controllers/adminControllers.js'

const router = express.Router()

//admin dashboard stats
router.get('/get-stats', strictedAuth, isAdmin, getAdminStats)

//delete user from admin only
router.delete('/delete-user', strictedAuth, isAdmin, deleteUser)
//get all users
router.get('/get-all-users', strictedAuth, isAdmin, getAllUsers)

//get count of resume by userid
router.get('/get-count-of-resume-by-userid', strictedAuth, isAdmin, getCountOfResumeByUser)

export default router