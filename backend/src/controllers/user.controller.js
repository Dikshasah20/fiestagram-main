import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.config.js";



export const register = async(req, res)=> {
  try {
    const {username, email, password} = req.body;
    if(!username || !email || !password){
      return res.status(401).json({
        message: "Something is misssing, please check!",
        success: false,
      })
    }
    const user = await User.findOne({ email});
    if(user){
      return res.status(401).json({
        message: "Email already exists",
        success: false,
      })
    };

    const isUsernameAvailable = await User.findOne({ email});
    if(isUsernameAvailable){
      return res.status(401).json({
        message: "Username has already taken",
        success: false,
      });
    };
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = await User.create({
      username,
      email,
      password: hashedPassword,
    })
    return res.status(201).json({
      message: "Account created successfully",
      success: true,
      user: createdUser,
    })
    
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: "internal server error",
      success: false,
    })
  }
}

export const login = async (req, res) => {
  console.log("login runned")
  console.log(req.body)
  try {
    const { identifier, password } = req.body;
    console.log("credentials "+identifier+" "+password);

    if (!password) {
      return res.status(401).json({
        message: "Password is required",
        success: false,
      });
    }

    // Check if the identifier (email or username) is missing
    if (!identifier) {
      return res.status(401).json({
        message: "Email or username is required",
        success: false,
      });
    }

    // Find user by either email or username
    let user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user) {
      return res.status(401).json({
        message: "User doesn't exist",
        success: false,
      });
    }

    // Compare the provided password with the user's stored password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Incorrect email/username or password",
        success: false,
      });
    }

    //populate each post id in the posts array
    const populatedPosts = await Promise.all(
      user.posts?.map(async (postId) => {
        const post = await Post.findById(postId);
        if(post?.author.equals(user._id)) return post;
        return null;
      })
    )

    user = {
      _id: user._id,
      email: user.email,
      username: user.username,
      profilePicture: user.profilePicture,
      gender: user.gender,
      followers: user.followers,
      following: user.following,
      posts: populatedPosts,
      bookmarks: user.bookmarks,
      bio: user.bio,
    };

    // Create JWT payload and token
    const payload = {
      userId: user._id,
    };

    const token = await jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "5h",
    });
    console.log("login done")

    // Set the token in an HTTP-only cookie
    return res.cookie("token", token, {
      httpOnly: true, 
      maxAge: 5 * 60 * 60 * 1000, // 5 hours in milliseconds

      // for development
      // secure: false,
      // sameSite: "strict",

      // for production
      sameSite: "none",
      secure: true,
    })
    .json({
      message: `Welcome back ${user.username}`,
      success: true,
      user,
      token,
    });

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: "Internal server error",
      success: false,
    });
  }
};

export const logout = async(req, res) => {
  try {
    return res.cookie("token", "",{
      maxAge: 0,
    }).json({
      message: "Logged out successfully",
      success: true
    })

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: "Internal server error",
      success: false,
    })
  }
}

export const getProfile = async (req, res) => {
  try {
    // const {id} = req.params;
    const userId = req.params.id;
    if(!userId) {
      return res.status(401).json({
        message: "params not found",
        success: false,
      });
    }
    let user = await User.findById(userId)
    .populate({
      path:"posts",
      createdAt: -1,
    }).populate(
      "bookmarks"
    );
    if(!user) {
      return res.status(401).json({
        message: "user not found",
        success: false,
      });
    }

    return res.status(200).json({
      user,
      success: true,
    })

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: "Internal server error",
      success: false,
    })
  }
};

export const editProfile = async (req, res) => {
  console.log("edit")
  try {
    let {bio ,gender} = req.body;
    if(bio) bio = bio.trim();
    if(gender) gender = gender.trim();
    const profilePicture = req.file;

    const userId = req.id;
    const user = await User.findById(userId).select("-password");
    if(!user){
      return res.status(404).json({
        message: "User not found",
        success: false,
      })
    }

    let cloudResponse = user.profilePicture;
    // if (profilePicture){
    //   const fileUri = getDataUri(profilePicture);
    //   cloudResponse = await cloudinary.uploader.upload(fileUri);
    // }

    if (profilePicture) {
      const fileUri = getDataUri(profilePicture);
      cloudResponse = await cloudinary.uploader.upload(fileUri).catch(err => {
        console.error(err);
        return res.status(500).json({ 
          message: "Error uploading profile picture to Cloudinary",
          success: false,
        });
      });
      // cloudResponse = cloudResponse.url;
      cloudResponse = cloudResponse.secure_url;
    }

    console.log(" gender check", gender)
    console.log(" bio check", bio)
    if(bio) user.bio = bio;
    if(gender) user.gender = gender;
    if(profilePicture) user.profilePicture = cloudResponse;
    await user.save();
    
    return res.status(200).json({
      message: "Profile updated",
      success: true,
      user,
    })

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: "Internal server error",
      success: false,
    })
  }
}

export const getSuggestedUsers = async(req,res) =>{
  try {
    const suggestedUsers = await User.find({ _id:{$ne:req.id} }).select("-password");
    if(!suggestedUsers){
      return res.status(404).json({
        message:"User suggesions not found",
        success: false,
      })
    }
    return res.status(200).json({
      success: true,
      users: suggestedUsers,
    })

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: "Internal server error",
      success: false,
    })
  }
}

export const followOrUnfollow = async(req,res) => {
  try {
    const hostUserId = req.id;
    const targetUserId = req.params.id;
    if(hostUserId === targetUserId){
      return res.status(400).json({
        message:"You can not follow/unfollow yourself",
        success: false,
      })
    }
    const hostUser = await User.findById(hostUserId);
    const targetUser = await User.findById(targetUserId);
    if(!hostUser || !targetUser){
      return res.status(400).json({
        message:"bad request",
      })
    }
    // check need to follow or unfollow
    const isAlreadyFollowing = hostUser.following.includes(targetUserId);
    if(isAlreadyFollowing){
      // unfollow
      await Promise.all([
        User.updateOne({_id:hostUserId}, {$pull:{following:targetUserId}}),
        User.updateOne({_id:targetUserId}, {$pull:{followers:hostUserId}}),
      ])
      return res.status(200).json({
        message: "Unfollowed successfully",
        success: true,
      })
    }else{
      // follow
      await Promise.all([
        User.updateOne({_id:hostUserId}, {$push:{following:targetUserId}}),
        User.updateOne({_id:targetUserId}, {$push:{followers:hostUserId}}),
      ])
      return res.status(200).json({
        message: "Follwed successfully",
        success: true,
      })
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: "Internal server error",
      success: false,
    })
  }
}

export const checkToken = async (req,res) => {
  try {
    const token = req.cookies?.token;
    if (token) {
      console.log("intoken found")
      return res.status(200).json({
        success: true,
        message: "token verified",
        verificationError: false,
      });
    }
    else{
      console.log("intoken not found ")
      return res.status(200).json({
        success: false,
        message: "token couldn't verified",
        verificationError: false,
      });
    }
    
  } catch (error) {
    console.error("Token checking Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      verificationError:true,
    });
  }
};