import express from 'express';
import { getCountOfResumesUser, getUser } from '../controllers/userController.js';
import { strictedAuth } from '../middlewares/strictedAuth.js';
const router = express.Router();


//get user
router.get('/get-user', strictedAuth, getUser)

//get count of resumes by user
router.get('/get-count-of-resumes', strictedAuth, getCountOfResumesUser)








export default router