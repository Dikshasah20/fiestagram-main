import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const AuthMiddleware = async (req, res, next) => {
  console.log("headers -> ", req.headers);
  try {
    const token =
      req.cookies?.token || req.headers?.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
        status: false,
      });
    }
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({
        message: "Invalid token",
        success: false,
      });
    }
    req.id = decoded.userId;
    next();
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: "Internal server error",
      success: false,
    });
  }
};
export default AuthMiddleware;
