import Resume from '../models/Resume.model.js'


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
        console.log('err while fetching resumes: ', err.message)
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}