import express from "express";
import AuthMiddleware from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";
import { addComment, addNewPost, bookMarkPost, deletePost, dislikePost, getAllPosts, getPostComments, getUserPosts, likePost } from "../controllers/post.controller.js";

const router = express.Router();


router.route("/addpost").post(AuthMiddleware, upload.single('image'), addNewPost);
router.route("/all").get(AuthMiddleware, getAllPosts);
router.route("/userpost/all").get(AuthMiddleware, getUserPosts);
router.route("/:id/like").get(AuthMiddleware, likePost);
router.route("/:id/dislike").get(AuthMiddleware, dislikePost);
router.route("/:id/comment").post(AuthMiddleware, addComment);
router.route("/:id/comment/all").post(AuthMiddleware, getPostComments);
router.route("/delete/:id").delete(AuthMiddleware, deletePost);
router.route("/:id/bookmark").get(AuthMiddleware, bookMarkPost)

export default router;



