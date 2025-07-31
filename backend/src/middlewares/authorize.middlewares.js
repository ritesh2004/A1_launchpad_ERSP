import { verifyToken } from "../utils/generateTokens.js";
import { HTTP_STATUS_CODES } from "../utils/httpStatus.js";

export const authorizeUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] || req.cookies?.accessToken;
    if (!token) {
      return res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({ message: "No token provided", success: false });
    }

    const user = verifyToken(token);
    if (!user) {
      return res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({ message: "Invalid token", success: false });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error authorizing user:", error);
    return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: "Error authorizing user", success: false });
  }
};

export const authorizeAdmin = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1] || req.cookies.accessToken;
        if (!token) {
            return res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({ message: "No token provided", success: false });
        }

        const user = verifyToken(token);
        if (!user) {
            return res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({ message: "Invalid token", success: false });
        }
        if (user.role !== "admin") {
            return res.status(HTTP_STATUS_CODES.FORBIDDEN).json({ message: "Access denied", success: false });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error("Error authorizing admin:", error);
        return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: "Error authorizing admin", success: false });
    }
}

export const authorizeServicer = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1] || req.cookies.accessToken;
        if (!token) {
            return res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({ message: "No token provided", success: false });
        }

        const user = verifyToken(token);
        if (!user) {
            return res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({ message: "Invalid token", success: false });
        }
        if (user.role !== "servicer") {
            return res.status(HTTP_STATUS_CODES.FORBIDDEN).json({ message: "Access denied", success: false });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error("Error authorizing servicer:", error);
        return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: "Error authorizing servicer", success: false });
    }
}