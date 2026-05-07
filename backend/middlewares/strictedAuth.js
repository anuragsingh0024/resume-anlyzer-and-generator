import jwt from 'jsonwebtoken'
import User from '../models/User.model.js'

export const strictedAuth = async (req, res, next) => {
    try {
        const token =
            req.cookies?.token ||
            req.headers.authorization?.split(" ")[1] || // Bearer token from Authorization header
            req.body.token;


        // If JWT is missing, return 401 Unauthorized response
        if (!token) {
            return res.status(403).json({ success: false, message: `Token Missing` });
        }

        //verify the token
        const decode = jwt.verify(token, process.env.JWT_SECRET);


        //storing the decode data into req
        req.user = decode;

        next();
    } catch (error) {
        console.error("Stricted Auth Error:", error.message);
        if (error.name === "TokenExpiredError") {
            return res
                .status(401)
                .json({ success: false, message: "Token expired" });
        }
        return res.status(500).json({ success: false, message: "Stricted auth failed" });
    }
}

export const isAdmin = async (req, res, next) => {
    try {
        //fetch the data
        const { id } = req.user;

        //validate
        const user = await User.findById(id);
        if (user.role !== "admin") {
            return res.status(400).json({
                success: false,
                message: "This is protected route for admin only",
            });
        }
        //next call
        next();
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

