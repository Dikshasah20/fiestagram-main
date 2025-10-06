import express from "express";
import { editProfile, followOrUnfollow, getProfile, checkToken, getSuggestedUsers, login, logout, register } from "../controllers/user.controller.js";
import AuthMiddleware from "../middlewares/auth.middleware.js";
import MulterMiddleware from "../middlewares/multer.middleware.js";
const router = express.Router();

router.route("/logout").get(logout); 
router.route("/checkToken").get(checkToken); 
router.route("/suggested").get(AuthMiddleware, getSuggestedUsers); 
router.route("/:id/profile").get(AuthMiddleware, getProfile); 
router.route("/register").post(register); 
router.route("/login").post(login); 
router.route("/profile/edit").post(AuthMiddleware, MulterMiddleware.single('profilePhoto'), editProfile); 
router.route("/followorunfollow/:id").post(AuthMiddleware, followOrUnfollow); 

export default router;