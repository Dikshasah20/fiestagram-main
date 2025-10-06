import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import useGetUserProfile from '@/customHooks/useGetUserProfile'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { AtSign, Heart, MessageCircle } from 'lucide-react'
import CommentDialog from './CommentDialog'
import { setSelectedPost } from '@/redux/postSlice'
import { setIsOpen } from '@/redux/dialogSlice'

const Profile = () => {
  const dispatch = useDispatch();
  const [active, setActive] = useState("posts");
  const params = useParams();
  useGetUserProfile(params.id);
  const { userProfile, user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const { isOpen } = useSelector((store) => store.dialog);
  const isFollowing = true;
  const isLoggedInUserProfile = user?._id === userProfile?._id;

  const handleTabChange = (tabTxt) => {
    setActive(tabTxt);
  }

  const handlePostClick = (clickedPostId) => {
    const searchedPost = posts?.find((p) => p._id === clickedPostId);
    dispatch(setSelectedPost(searchedPost));
    dispatch(setIsOpen(true));
    console.log("Dialog state:", open); // Debugging
  };

  let displayedPosts = active === "posts" ? userProfile?.posts : userProfile?.bookmarks;

  return (
    <div className='flex max-w-5xl justify-center my-8 pl-4  ml-auto'>
      <div className='flex flex-col gap-20'>
        <div className='grid grid-cols-2'>

          <section className='flex items-center justify-center'>
            <Avatar className="h-32 w-32">
              <AvatarImage src={userProfile?.profilePicture || ""} alt="profile" />
              <AvatarFallback className="font-semibold text-4xl bg-gray-200">
                {userProfile?.username?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </section>

          <section>
            <div className='flex flex-col pt-5 gap-5'>
              <div className='flex items-center gap-2'>
                <span className=' mr-4'>{userProfile?.username}</span>
                {
                  isLoggedInUserProfile ? (
                    <> <Link to={`/account/edit`}>
                      <Button varient="secondary" className="rounded-[6px] bg-gray-200 hover:bg-gray-100 h-8">Edit profile</Button>
                    </Link>
                      <Button varient="secondary" className="rounded-[6px] bg-gray-200 hover:bg-gray-100 h-8">View archieve</Button>
                      <Button varient="secondary" className="rounded-[6px] bg-gray-200 hover:bg-gray-100 h-8">Add tools</Button>
                    </>
                  ) : (
                    isFollowing ? (
                      <>
                        <Button className="bg-[#0095F6] rounded-[6px] hover:bg-[#38a2e8] h-8">Unfollow</Button>
                        <Button className="bg-gray-200 rounded-[6px] hover:bg-gray-100 h-8">Message</Button>
                      </>
                    ) : (
                      <Button className="bg-[#0095F6] rounded-[6px] hover:bg-[#38a2e8] h-8">Follow</Button>
                    )
                  )
                }
              </div>
              <div className='flex items-center gap-4'>
                <p ><span className='font-semibold'>{userProfile?.posts.length}    </span> posts</p>
                <p ><span className='font-semibold'>{userProfile?.followers.length}</span> followers</p>
                <p ><span className='font-semibold'>{userProfile?.following.length}</span> following</p>
              </div>
              <div className='flex flex-col gap-1'>
                <span className='font-semibold'>{userProfile?.bio || "Bio here"}</span>
                <Badge className="w-fit rounded-xl bg-gray-100"><AtSign size={13} /> <span className='pl-1'>{userProfile?.username}</span>
                </Badge>
                <span>🎉😊🚀Learn code with Chandrashekhar</span>
                <span>🎉😊🚀Learn code with Chandrashekhar</span>
                <span>🎉😊🚀Learn code with Chandrashekhar</span>
              </div>
            </div>
          </section>

        </div>
        <div className=' border-t border-t-gray-200'>
          <div className='flex items-center justify-center gap-10 text-sm'>
            <span onClick={() => handleTabChange("posts")}
              className={`${active === "posts" ? "font-bold" : ""} py-3 cursor-pointer`}>
              POSTS
            </span>
            <span onClick={() => handleTabChange("saved")}
              className={`${active === "saved" ? "font-bold" : ""} py-3 cursor-pointer`}>
              SAVED
            </span>
            <span onClick={() => handleTabChange("reels")}
              className={`${active === "reels" ? "font-bold" : ""} py-3 cursor-pointer`}>
              REELS
            </span>
            <span onClick={() => handleTabChange("tags")}
              className={`${active === "tags" ? "font-bold" : ""} py-3 cursor-pointer`}>
              TAGS
            </span>
          </div>
          <div className='grid grid-cols-3 gap-1'>
            {
              displayedPosts?.length > 0 ? (displayedPosts.map((post) => {
                return (
                  <div onClick={()=>handlePostClick(post._id)} key={post._id}
                    className='relative cursor-pointer group'>
                    <img 
                      src={post.image} alt="post"
                      className=' w-full aspect-square object-cover' 
                    />
                    <CommentDialog isOpen={isOpen} />
                    <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 '>
                      <div className='flex items-center space-x-4 gap-2 hover:text-gray-300'>
                        <button className="flex items-center gap-1 text-white">
                          <Heart className='fill-white' />
                          <span className='font-bold'> {post?.likes.length}</span>
                        </button>
                        <button className="flex gap-1 items-center text-white">
                          <MessageCircle className='fill-white' />
                          <span className='font-bold'> {post?.comments.length}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })) :
                (
                  <div className=' mx-auto my-5 '>
                    <div className='flex items-center justify-end '>
                      No Posts Yet
                    </div>
                  </div>
                )
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile