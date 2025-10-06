import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import { useRef, useState } from 'react'
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { readFileAsDataUrL } from "@/lib/utils";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/redux/postSlice";


const CreatePost = ({ open, setOpen }) => {
  const dispatch = useDispatch();
  const {user, token} = useSelector((store)=>store.auth);
  const {posts} = useSelector((store)=>store.post);
  const imageInputRef = useRef();
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);

  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    try { 
      if (!file) {
        toast.error("file not found!");
      } else {
        setFile(file);
        const dataUri = await readFileAsDataUrL(file);
        setImagePreview(dataUri);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const createPostHandler = async () => {
    console.log("data ", file)
    console.log("caption ", caption)
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("caption", caption?.trim());
      if (imagePreview) formData.append("image", file);
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/post/addpost`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization":`Bearer ${token}`
          },
          withCredentials: true,
        }
      )
      if (response.data.success) {
        dispatch(setPosts([ response.data.post, ...posts]))
        setOpen(false);
        toast.success(response.data.message);
      }

    } catch (error) {
      console.log({ error: error.message });
      toast.error(error.response.data.message)
    } finally {
      setLoading(false)
    }
  }
  return ( 
    <Dialog  open={open}>
      <DialogContent className=" bg-white" onInteractOutside={() => setOpen(false)} >
        <DialogHeader className="text-center font-semibold">
          Create New Post
        </DialogHeader>
        <div className="flex gap-3 items-center">
          <Avatar className="bg-gray-100 rounded-full">
            <AvatarImage src={user?.profilePicture ||""} alt="profile" />
            <AvatarFallback>{user?.username?.[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-sm">{user?.username}</h1>
            <span className="font-semibold text-gray-600 text-xs">{user?.bio || ""}</span>
          </div>
        </div>
        <Textarea value={caption} onChange={(e) => setCaption(e.target.value)}
          className="focus-visible:ring-transparent border-none" placeholder="Write a caption..." />
        {
          imagePreview &&
          <div className="w-full h-64 flex items-center justify-center">
            <img src={imagePreview} alt="preview"
              className="object-cover rounded-md h-full w-full" />
          </div>
        }
        <input onChange={fileChangeHandler} ref={imageInputRef} className="hidden" type="file" />
        <Button onClick={() => imageInputRef.current.click()} className="text-white rounded-[6px] w-fit mx-auto bg-[#0095F6] hover:bg-[#258bcf]">Select from computer</Button>
        {
          imagePreview && (
            loading ? <Button>
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
              Please wait...
            </Button>
              : <Button onClick={createPostHandler} type="submit" className="w-full bg-black hover:bg-gray-800 rounded-[6px] text-white">Post</Button>
          )

        }
      </DialogContent>
    </Dialog>
  )
}

export default CreatePost