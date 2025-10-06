import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const SuggestedUsers = () => {
  const { suggestedUsers } = useSelector((store) => store.auth);
  const [seeAll, setSeeAll] = useState(false);

  return (
    <div className='my-5'>
      <div className='flex items-center gap-4 justify-between text-sm'>
        <h1 className='text-gray-600 font-semibold'>Suggested for you</h1>
        <span onClick={()=>setSeeAll(!seeAll)} className='font-medium text-bolder text-gray-800 cursor-pointer'>See All</span>
      </div>
      {suggestedUsers && !seeAll?
      (suggestedUsers.slice(0,5).map((user) => {
        return (
          <div className='my-5' key={user._id}>
            <div className='flex items-center justify-between gap-6'>
              <Link to={`/profile/${user?._id}`}>
                <Avatar className="hover:outline hover:outline-blue-500">
                  <AvatarImage src={user?.profilePicture || ""} alt="profile" />
                  <AvatarFallback className="font-semibold bg-gray-200">
                    {user?.username?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div className='gap-0 flex flex-col justify-start'>
                <h1 className='font-semibold text-sm '><Link to={`/profile/${user?._id}`}>
                {user?.username}</Link>
                </h1>
                {/* <span className='text-sm text-gray-600'> {user?.bio || 'Bio here...'}</span> */}
                <span className='text-xs text-gray-600 '>Suggested for you</span>
              </div>
            <span className='text-[#3BADF8] hover:text-[#3495d6] cursor-pointer font-bold text-xs'>Follow</span>
            </div>
          </div>
        )
      })):
      suggestedUsers.map((user) => {
        return (
          <div className='my-5' key={user._id}>
            <div className='flex items-center justify-between gap-6'>
              <Link to={`/profile/${user?._id}`}>
                <Avatar className="hover:outline hover:outline-blue-500">
                  <AvatarImage src={user?.profilePicture || ""} alt="profile" />
                  <AvatarFallback className="font-semibold bg-gray-200">
                    {user?.username?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div className='gap-0 flex flex-col justify-start'>
                <h1 className='font-semibold text-sm '><Link to={`/profile/${user?._id}`}>
                {user?.username}</Link>
                </h1>
                {/* <span className='text-sm text-gray-600'> {user?.bio || 'Bio here...'}</span> */}
                <span className='text-xs text-gray-600 '>Suggested for you</span>
              </div>
            <span className='text-[#3BADF8] hover:text-[#3495d6] cursor-pointer font-bold text-xs'>Follow</span>
            </div>
          </div>
        )
      })
      }
    </div>
    
  )
}

export default SuggestedUsers