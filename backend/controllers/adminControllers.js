import Resume from '../models/Resume.model.js'
import User from '../models/User.model.js'

export const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalResumes = await Resume.countDocuments();
        const resumes = await Resume.find({}, { "analysis.ats.score": 1, meta: 1 });

        let totalScore = 0;
        let scoredCount = 0;
        let guestCount = 0;

        resumes.forEach(r => {
            if (r.analysis?.ats?.score) {
                totalScore += r.analysis.ats.score;
                scoredCount++;
            }
            if (r.meta?.uploadType === 'guest') {
                guestCount++;
            }
        });

        const avgAtsScore = scoredCount > 0 ? Math.round(totalScore / scoredCount) : 0;

        return res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalResumes,
                avgAtsScore,
                guestUploads: guestCount
            }
        });
    } catch (err) {
        console.log('err while fetching admin stats: ', err.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const getCountOfResumeByUser = async (req, res) => {
    try {
        const { userId } = req.body
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User id not found"
            })
        }
        const countOfResumes = await Resume.countDocuments({ userId: userId })
        return res.status(200).json({
            success: true,
            message: "count of resumes fetched",
            countOfResumes: countOfResumes || 0
        })
    } catch (err) {
        console.log('err while fetching resumes: ', err.message)
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}