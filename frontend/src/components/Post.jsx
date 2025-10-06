import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog } from "./ui/dialog";
import { DialogContent, DialogTrigger } from "./ui/dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { IoBookmark } from "react-icons/io5";
import { Button } from "./ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Badge } from "./ui/badge";
import { Link } from "react-router-dom";
import { setIsOpen } from "@/redux/dialogSlice";
import { setAuthUser } from "@/redux/authSlice";

const Post = ({ post = {} }) => {
  const dispatch = useDispatch();
  const { posts } = useSelector((store) => store.post);
  const { user, token } = useSelector((store) => store.auth);
  const {isOpen} = useSelector((store) => store.dialog)
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [liked, setLiked] = useState(post?.likes?.includes(user?._id) || false);
  const [postLikes, setPostLikes] = useState(post?.likes?.length || 0);
  const [comment, setComment] = useState(post?.comments || []);

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const likeOrDislikeHandler = async () => {
    if (!post?._id) return toast.error("Post ID is missing.");

    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/post/${post._id}/${action}`,
        { 
          headers: {
            "Authorization": `Bearer ${token}`
          },
          withCredentials: true }
      );

      if (res.data.success) {
        setPostLikes(liked ? postLikes - 1 : postLikes + 1);

        const updatedposts = posts.map((p) =>
          p._id === post._id
            ? {
              ...p,
              likes: liked
                ? p.likes.filter((id) => id !== user?._id)
                : [...p.likes, user?._id],
            }
            : p
        );

        setLiked(!liked);
        dispatch(setPosts(updatedposts));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "An error occurred.");
    }
  };

  const deletePostHandler = async () => {
    if (!post?._id) return toast.error("Post ID is missing.");

    setLoading(true);
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/post/delete/${post._id}`,
        {
          headers:{
            "Authorization": `Bearer ${token}`
          },
          withCredentials: true }
      );

      if (res.data.success) {
        dispatch(setPosts(posts.filter((p) => p._id !== post?._id)));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Couldn't delete post");
    } finally {
      setLoading(false);
    }
  };

  const commentHandler = async () => {
    if (!post?._id) return toast.error("Post ID is missing.");
    if (!text.trim()) return toast.error("Comment text cannot be empty.");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/post/${post?._id}/comment`,
        { text },
        {
          headers: {
            "Authorization":`Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostsData = posts.map((p) =>
          p._id === post?._id
            ? { ...p, comments: updatedCommentData }
            : p
        );

        dispatch(setPosts(updatedPostsData));
        setText(""); // Clear the input after posting a comment
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to add comment.");
    }
  };

  const bookmarkHandler = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/post/${post?._id}/bookmark`,
        {
          headers: {
            "Authorization": `Bearer ${token}`
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        if (res.data.type === "saved") {
          // Use non-mutating update for bookmarks
          const updatedBookmarks = [...(user?.bookmarks || []), post._id];
          dispatch(setAuthUser({ ...user, bookmarks: updatedBookmarks }));
        }
        if (res.data.type === "unsaved") {
          // Filter out the post ID from bookmarks
          const updatedBookmarks = user?.bookmarks.filter((p) => p !== post._id);
          dispatch(setAuthUser({ ...user, bookmarks: updatedBookmarks }));
        }
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update bookmark.");
    }
  };
  

  return (
    // lg:max-w-sm
    <div className="my-8  w-full pr-0 sm:pl-16 sm:max-w-[490px] md:max-w-[600px] lg:max-w-[590px]  mx-auto">
      <div className="px-1 flex items-center justify-between">
        <div className="flex items-center gap-2">
        <Link to={`/profile/${post?.author?._id}`}>
          <Avatar>
            <AvatarImage
              src={post?.author?.profilePicture || ""}
              alt={post?.author?.username || "User"}
            />
            <AvatarFallback className="font-semibold bg-gray-200">
              {post?.author?.username?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          </Link>
          <div className="flex gap-3 items-center">
            <Link to={`/profile/${post?.author?._id}`}> <h1>{post?.author?.username || "Unknown User"}</h1></Link>
            {user?._id === post?.author._id &&<Badge className="bg-gray-100" variant="secondary">Author</Badge>}
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm bg-gray-300 rounded-md text-center">
          {user?._id !== post?.author?._id && (
            <Button varient="ghost" className="font-bold cursor-pointer w-fit hover:bg-red-500 bg-red-600 rounded-[6px] text-white">
              Unfollow
            </Button>
            )}
            <Button varient="ghost" className="cursor-pointer w-fit">
              Add to favorites
            </Button>
            {user?._id === post?.author?._id && (
              <Button
                onClick={deletePostHandler}
                varient="ghost"
                className="cursor-pointer hover:bg-red-500 bg-red-600 rounded-[6px] text-white w-fit"
              >
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <img
        src={post?.image || ""}
        alt="post"
        className="rounded-[3px] w-full my-2 aspect-square  object-cover"
      />
      <div>
        <div className="flex items-center justify-between my-2">
          <div className="flex items-center gap-3">
            {liked ? (
              <FaHeart
                onClick={likeOrDislikeHandler}
                size={"24px"}
                className="cursor-pointer text-red-600"
              />
            ) : (
              <FaRegHeart
                onClick={likeOrDislikeHandler}
                size={"24px"}
                className="cursor-pointer"
              />
            )}
            <MessageCircle
              onClick={() => {
                dispatch(setSelectedPost(post));
                dispatch(setIsOpen(true));
              }}
              className="cursor-pointer hover:text-gray-600"
            />
            <Send className="cursor-pointer hover:text-gray-600" />
          </div>
          {
            user?.bookmarks.includes(post?._id) ?(
              <IoBookmark onClick={bookmarkHandler} className=" text-2xl cursor-pointer hover:text-gray-600" />
            ):(
              <Bookmark onClick={bookmarkHandler} className="cursor-pointer hover:text-gray-600" />
            )
          }
        </div>
        <span className="font-medium block mb-2">{postLikes} likes</span>
        <p>
          <span className="font-medium mr-2">
            {post?.author?.username || "Unknown"}
          </span>
          {post?.caption || ""}
        </p>
        {comment?.length > 0 &&
          (<span
            className="cursor-pointer text-gray-400 text-sm"
            onClick={() => {
              dispatch(setSelectedPost(post));
              dispatch(setIsOpen(true));
            }}
          >
            View all {comment?.length || 0} comments
          </span>)
        }
        <CommentDialog isOpen={isOpen}/>
        <div className="flex items-center justify-between">
          <input
            type="text"
            placeholder="Add a comment..."
            value={text}
            onChange={changeEventHandler}
            className="outline-none text-sm w-full"
          />
          {text && (
            <span onClick={commentHandler} className="text-[#3BADF8] cursor-pointer">
              Post
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Post;
