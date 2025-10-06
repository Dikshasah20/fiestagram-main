import CreatePost from "./CreatePost";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { setAuthUser, setToken } from "@/redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { FaInstagram } from "react-icons/fa";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { timeAgo } from "@/utils/timeCalc";
import { resetLikeNotification } from "@/redux/notificationSlice";

const LeftSidebar = () => {
  const {likeNotification} = useSelector((store)=>store.realTimeNotification);
  const navigate = useNavigate();
  const { user, token } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const logout = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/user/logout`, {
        headers: {
          "Authorization": `Bearer ${token}`
        },
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setToken(null));
        dispatch(setSelectedPost(null));
        dispatch(setPosts([]));
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.res.data.message);
    }
  };

  const handleClick = (textType) => {
    if (textType === "Logout") {
      logout();
    } else if (textType === "Create") {
      setOpen(true);
    } else if (textType === "Home") {
      navigate("/");
    } else if (textType === "Messages") {
      navigate("/chat");
    } else if (textType === "Profile") {
      navigate(`/profile/${user?._id}`)
    } else if (textType === "Notifications") {
      return;
    } else alert(textType);
  };

  const sidebarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <TrendingUp />, text: "Explore" },
    { icon: <MessageCircle />, text: "Messages" },
    { icon: <Heart />, text: "Notifications" },
    { icon: <PlusSquare />, text: "Create" },
    {
      icon: (
        <Avatar className="w-8 h-8">
          {user ? (
            <AvatarImage src={user?.profilePicture} alt="user profile" />
          ) : (
            <AvatarImage src="" alt="user profile" />
          )}
          <AvatarFallback className="font-semibold bg-gray-200">
            {user?.username?.[0]?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogOut />, text: "Logout" },
  ];

  return (
    <div className="fixed top-0 z-10 left-0 px-2 border-r border-gray-300 hidden sm:block sm:w-[10%]  lg:w-[18%] h-screen">
      <div className="flex flex-col">
        <Link to="/">
          <h1 className="text-[#5D3FD3] text-xl font-bold pl-3 my-8 hidden lg:block">
            𝐹𝐼𝐸𝒮𝒯𝒜𝒢𝑅𝒜𝑀
          </h1>
            <FaInstagram size={35} className="text-[#5D3FD3] font-bol pl-4 my-7 block lg:hidden"/>
        </Link>
        <div>
          {sidebarItems.map((item, index) => {
            return (
              <div
                key={index}
                className={`flex relative items-center gap-3 rounded-xl hover:bg-gray-100 
                  ${item.text !== "Notifications"?"cursor-pointer":""} 
                  p-3 my-3`}
                onClick={() => handleClick(item.text)}
              >
                {item.icon}
                {/* Show text only on large screens */}
                <span className="hidden lg:block">{item.text}</span>
                {item.text === "Notifications" && likeNotification?.length> 0 && (
                  <Popover onOpenChange={(isOpen) => {
                    if (!isOpen) {
                      dispatch(resetLikeNotification([])); // Reset notifications when dialog closes
                    }
                  }}>
                    <PopoverTrigger  asChild>
                        <Button className="rounded-full hover:bg-red-600 bg-red-600 text-white h-5 w-5 absolute bottom-6 left-6"
                        size="icon">{likeNotification?.length}</Button>
                    </PopoverTrigger>
                    <PopoverContent className="flex w-120 overflow-y-auto mt-3  flex-grow  rounded-[14px] bg-[#303039]">
                      <div>
                        {
                          likeNotification?.length == 0 ?(
                            <p> No new notifications!</p>
                          ):(
                            likeNotification.map((nft)=>{
                              return (
                                <div className=" text-white py-1 rounded-[8px] border-none" key={nft.userId}>
                                  <div className="flex items-center gap-3">
                                  <Avatar>
                                    <AvatarImage src={nft?.userDetails?.profilePicture} />
                                    <AvatarFallback className="bg-gray-200 text-black font-semibold">{nft?.userDetails.username?.[0].toUpperCase()}</AvatarFallback>
                                  </Avatar>
                                  <p className="text-sm "> 
                                    <span className="font-bold">{nft.userDetails?.username}</span> {nft.type}d your post
                                  </p>
                                  <div className="text-xs text-gray-400"> {timeAgo(nft.time)}</div>
                                  </div>
                                </div>
                                
                              )
                            })
                          )
                        }
                      </div>
                    </PopoverContent>
                  </Popover>
                )
                }
              </div>
            );
          })}
        </div>
      </div>
      <CreatePost open={open} setOpen={setOpen} />
    </div>
  );
};

export default LeftSidebar;
