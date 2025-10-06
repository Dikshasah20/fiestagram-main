import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";
import sharp from "sharp";
import cloudinary from "../utils/cloudinary.config.js";
import { getRecieverSocketId, io } from "../socket/socket.js";

export const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id;

    if (!image) return res.status(400).json({ message: "Image required" });

    // image upload
    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    // buffer to data uri
    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
      "base64"
    )}`;
    const cloudResponse = await cloudinary.uploader.upload(fileUri);
    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: authorId,
    });
    const user = await User.findById(authorId);
    if (user) {
      user.posts.push(post._id);
      await user.save();
    }

    await post.populate({ path: "author", select: "-password" });

    return res.status(201).json({
      message: "New post added",
      post,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAllPosts = async (req, res) => {
  console.log("getting all posts")
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "username profilePicture" },
      });
    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: "Internal server error",
      success: false,
    });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const authorId = req.id;
    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "username profilePicture",
      })
    .populate({
      path:"comments",
      populate:{
        path: "author",
        select:"username profilePicture",
      }
    })

    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: "Internal server error",
      success: false,
    });
  }
};


export const likePost = async (req, res) => {
  // postId require in req.params
  try {
    const hostUserId = req.id;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }

    // we can use this comment code instead of  uncomment code, but in this code same user can like one most multiple times(logical error)
    // post.likes.push({likes:hostUserId});
    // await post.save();
    await post.updateOne({ $addToSet: { likes: hostUserId } });
    await post.save();

    // implementing socket.io for realtime notification
    const user = await User.findById(hostUserId).select("username profilePicture");
    const postOwnerId = post.author.toString();
    if(postOwnerId !== hostUserId){
      const notification = {
        type:"like",
        userId: hostUserId,
        userDetails:user,
        postId,
        message:"Your post was liked",
        time: Date.now(),
      }

      const postOwnerSocketId = getRecieverSocketId(postOwnerId)
      io.to(postOwnerSocketId).emit("notification", notification);
    }


    return res.status(200).json({
      message: "Post liked",
      success: true,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: "Internal server error",
      success: false,
    });
  }
};

export const dislikePost = async (req, res) => {
  try {
    const hostUserId = req.id;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }
    await post.updateOne({ $pull: { likes: hostUserId } });
    await post.save();
    // implementing socket.io for realtime notification
    const user = await User.findById(hostUserId).select("username profilePicture");
    const postOwnerId = post.author.toString();
    if(postOwnerId !== hostUserId){
      const notification = {
        type:"dislike",
        userId: hostUserId,
        userDetails:user,
        postId,
        message:"Your post was disliked",
        time: Date.now(),
      }

      const postOwnerSocketId = getRecieverSocketId(postOwnerId)
      io.to(postOwnerSocketId).emit("notification", notification);
    }

    res.status(200).json({
      message: "Post disliked",
      success: true,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: "Internal server error",
      success: false,
    });
  }
};

export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      res.status(400).json({
        message: "Text is required",
        success: false,
      });
    }
    const hostUserId = req.id;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }
    const comment = await Comment.create({
      text,
      author: hostUserId,
      post: postId,
    })
    await comment.populate({
      path: "author",
      select: "username profilePicture",
    });

    post.comments.push(comment);
    await post.save();
    return res.status(200).json({
      message: "Comment added",
      comment,
      success: true,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: "Internal server error",
      success: false,
    });
  }
};

export const getPostComments = async (req, res) => {
  try {
    // const {id: postId} = req.params;
    const postId = req.params.id;
    const hostUserId = req.params.id;

    const comments = await Comment.find({ post: postId }).populate({
      path: "author",
      select: "username profilePicture",
    });

    if (!comments) {
      res.status(404).json({
        message: "No comments yet",
        success: false,
      });
    }
    return res.status(200).json({
      comments,
      success: true,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: "Internal server error",
      success: false,
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const hostUserId = req.id;

    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }
    // check if the logged in use is actually owner of the post
    if (post.author.toString() !== hostUserId) {
      res.status(403).json({
        message: "Unauthorized",
        success: false,
      });
    }
    // delete post
    await Post.findByIdAndDelete(postId);
    let user = await User.findById(hostUserId);
    // remove post from user's posts array
    user.posts.filter((id) => id.toString() !== postId);
    await user.save();
    // delete all comments associated with post
    await Comment.deleteMany({ post: postId });
    res.status(200).json({
      message: "Post deleted",
      success: true,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: "Internal server error",
      success: false,
    });
  }
};

export const bookMarkPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const hostUserId = req.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }
    const user = await User.findById(hostUserId);
    if (!user) {
      return res.status(403).json({
        message: "Unauthorized",
        success: false,
      });
    }
    if (user.bookmarks.includes(post._id)) {
      // remove post from bookmarks array
      await user.updateOne({ $pull: { bookmarks: post._id } });
      await user.save();
      res.status(200).json({
        type: "unsaved",
        success: true,
        message: "Post removed from bookmarks",
      });
    } else {
      // bookmark post
      await user.updateOne({ $addToSet: { bookmarks: post._id } });
      await user.save();
      res.status(200).json({
        type: "saved",
        success: true,
        message: "Post Bookmarked",
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: "Internal server error",
      success: false,
    });
  }
};
