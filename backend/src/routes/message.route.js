import express from "express";
import AuthMiddleware from "../middlewares/auth.middleware.js";
import { getMessage, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();


router.route("/send/:id").post(AuthMiddleware, sendMessage);
router.route("/all/:id").get(AuthMiddleware, getMessage);

export default router;