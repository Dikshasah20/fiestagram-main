import { DialogTrigger } from "@radix-ui/react-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Dialog, DialogContent } from "./ui/dialog"
import { useEffect, useRef, useState } from 'react'

import { Link } from 'react-router-dom'
import { Loader2, MoreHorizontal, SmileIcon } from "lucide-react"
import { Button } from "./ui/button"
import { useDispatch, useSelector } from "react-redux"
import Comment from "./Comment"
import axios from "axios"
import { toast } from "sonner";
import { setPosts } from "@/redux/postSlice"
import EmojiPicker from "emoji-picker-react"
import { setIsOpen } from "@/redux/dialogSlice"

const CommentDialog = ({isOpen}) => {
  const dispatch = useDispatch();
  // const { isOpen } = useSelector((store) => store.dialog);
  const { selectedPost, posts } = useSelector((store) => store.post);
  const { user } = useSelector((store) => store.auth);
  const [comment, setComment] = useState([])
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [text, setText] = useState("");
  const {token} = useSelector((store) => store.auth);


  useEffect(() => {
    if (selectedPost) {
      setComment(selectedPost?.comments);
    }
  }, [selectedPost])

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    setShowEmojiPicker(false);
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  }

  const sendMessageHandler = async () => {
    if (!text.trim()) return toast.error("Comment text cannot be empty.");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/post/${selectedPost?._id}/comment`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostsData = posts.map((p) =>
          p._id === selectedPost?._id
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

  const addEmoji = (emojiObject) => {
    setText((prevText) => prevText + emojiObject.emoji); // Append selected emoji to text
  };

  const previewConfig = {
    defaultCaption: "What's your mood?",
    showPreview: false, // defaults to: true
    skinTonesDisabled: false,
  }
  const compnentRef = useRef(null);

  useEffect(() => {
    // dispatch(setIsOpen(false));
    console.log(("open sttus", isOpen))
    const handleClickOutside = (event) => {
      if (compnentRef.current && !compnentRef.current.contains(event.target)) {
        dispatch(setIsOpen(false));
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    
  }, [isOpen]);

  return (
    <Dialog   open={isOpen}>
      <DialogContent 
      ref={compnentRef}
      onInteractiveOutside={()=> dispatch(setIsOpen(false))}
      
      className="max-w-4xl p-0 flex flex-col">
      {/* <DialogContent  className="max-w-4xl p-0 flex border-0 flex-col"> */}
        {selectedPost ? (
          <div className='  w-full bg-white flex flex-1'>
            <div className='w-1/2'>
              <img src={selectedPost?.image}
                className='w-full h-full object-cover aspect-square rounded-l-lg'
                alt='post' />
            </div>
            <div className='w-1/2 flex flex-col justify-between'>
              <div className='p-4 flex items-center justify-between'>
                <div className="flex gap-3 items-center">
                  <Link>
                    <Avatar>
                      <AvatarImage src={selectedPost?.author?.profilePicture} />
                      <AvatarFallback>{selectedPost?.author?.username?.[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Link>
                  <div className="flex gap-1 items-center">
                    <Link className="font-bold text-sm">{selectedPost?.author?.username} </Link>
                    {user?._id !== selectedPost?.author?._id && (
                      <>
                        <span className=" text-2xl font-bold">⋅</span>
                        <Button className=" p-0 rounded-[6px]  hover:text-black text-[#0095f6]">Follow</Button>
                      </>
                    )}
                  </div>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <MoreHorizontal className="cursor-pointer" />
                  </DialogTrigger>
                  <DialogContent className="flex flex-col items-center text-sm text-center bg-white">
                    <div className="cursor-pointer w-full text-[#ED4956] font-bold">
                      Unfollow
                    </div>
                    <div className="cursor-pointer w-full">
                      Add to favorites
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <hr />
              {/* comments  */}
              <div className="flex-1 overflow-y-auto max-h-96 p-4">
                {
                  selectedPost?.caption &&
                  <div className=" flex items-center gap-2">
                    <Link>
                      <Avatar>
                        <AvatarImage src={selectedPost?.author?.profilePicture} />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    </Link>
                    <span className="pl-1 font-bold text-sm">{selectedPost?.author?.username}</span>
                    <span className=" text-sm">{selectedPost?.caption}</span>
                  </div>
                }
                {selectedPost &&
                  comment.map((comment) => {
                    return <Comment key={comment._id} comment={comment} />
                  })
                }
              </div>
              {showEmojiPicker && (
                <div className="p-8  absolute z-50">
                  <EmojiPicker previewConfig={previewConfig} className="text-gray-100" height="350px" onEmojiClick={addEmoji} />
                </div>
              )}
              <div className="p-3 pl-2 ">
                {/* <hr className="border-t flex flex-1 p-0 border-t-gray-300 w-full py-1" /> */}
                <div className="flex items-center gap-2">
                  <div className="">
                    <button className="text-xl border-none outline-none" onClick={() => setShowEmojiPicker((prev) => !prev)}>
                      <SmileIcon className="hover:text-yellow-600  bg-transparent hover:cursor-pointer" />
                    </button>
                  </div>

                  <input value={text} onChange={changeEventHandler} type="text" placeholder="Add a comment..."
                    className="w-fulll flex-1 text-sm outline-none border border-gray-300 p-2 rounded-[6px]" />
                  <Button disabled={!text.trim()} onClick={sendMessageHandler}
                    className=" rounded-[6px]  hover:text-black text-blue-500">Post</Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className=' bg-white flex flex-1'>
            <Loader2 className="h-4 w-4" />
          </div>
        )
        }
      </DialogContent>
    </Dialog>
  )
}

export default CommentDialog