import express from 'express';
const router = express.Router();
import { uploadResume, anlyzeResume, getActiveResumeGuest, updateGuestToUser, getActiveResumeUser, getAllResume, getAllResumeByUser, makeActiveResume, resumeGenerator } from '../controllers/resumeController.js';
import { optionalAuth } from '../middlewares/optionalAuth.js';
import { strictedAuth, isAdmin } from '../middlewares/strictedAuth.js';

//upload resume
router.post('/upload-resume', optionalAuth, uploadResume);

//anlyze resume
router.post('/anlyze-resume', anlyzeResume)

//get resume
router.get('/get-active-resume-guest/:tempId', getActiveResumeGuest)
router.get('/get-active-resume-user', strictedAuth, getActiveResumeUser)
router.get('/get-all-resumes-user', strictedAuth, getAllResumeByUser)
router.put('/make-active-resume', strictedAuth, makeActiveResume)

//update guest to user
router.put('/update-guest-to-user', strictedAuth, updateGuestToUser)



//for admin
router.get('/admin/all-resumes', strictedAuth, isAdmin, getAllResume)

//generate resume
router.post('/generate-resume', strictedAuth, resumeGenerator)

export default router;