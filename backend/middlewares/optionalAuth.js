import jwt from "jsonwebtoken";

export const optionalAuth = (req, res, next) => {
    try {
        let token =
            req.cookies?.token ||
            req.headers.authorization?.replace(/^Bearer\s+/i, "") ||
            req.body?.token;

        if (typeof token === 'string' && (token.startsWith('"') || token.startsWith("'"))) {
            token = token.slice(1, -1);
        }

        if (!token) {
            return next(); // guest user
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {
            id: decoded.id,
        };

        next();
    } catch (error) {
        console.error("Optional Auth Error:", error.message);
        next(); // continue as guest on error
    }
};