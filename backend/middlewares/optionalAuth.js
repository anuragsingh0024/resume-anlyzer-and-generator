import jwt from "jsonwebtoken";

export const optionalAuth = (req, res, next) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return next(); // 🔥 no error, guest user
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {
            id: decoded.id,

        };

        next();
    } catch (error) {
        console.error("Optional Auth Error:", error.message);
        next(); // 🔥 even if error, continue as guest
    }
};