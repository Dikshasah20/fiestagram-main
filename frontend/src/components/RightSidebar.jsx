import React from 'react';
import { AvatarImage, Avatar, AvatarFallback } from './ui/avatar';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import SuggestedUsers from './SuggestedUsers';

const RightSidebar = () => {
  const { user } = useSelector((store) => store.auth);

  return (
    <div className="hidden lg:block w-60 my-5 pr-8">
      {/* User Info */}
      <div className="flex items-center gap-4 mb-6">
        <Link to={`/profile/${user?._id}`}>
          <Avatar className="hover:outline hover:outline-blue-500">
            <AvatarImage src={user?.profilePicture || ""} alt={`${user?.username || "User"}'s profile`} />
            <AvatarFallback className="font-semibold bg-gray-200">
              {user?.username?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex flex-col justify-start">
          <h1 className="font-semibold text-sm">
            <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
          </h1>
          <span className="text-sm text-gray-600">{user?.bio || "Add a bio to let others know more about you!"}</span>
        </div>
      </div>

      {/* Suggested Users */}
      <SuggestedUsers />

      {/* Footer Section */}
      <div className="mt-6 text-xs text-gray-500">
        <p className="mb-1">About • Help • Press • API • Jobs • Privacy • Terms</p>
        <p className="mb-1">Locations • Language • © {new Date().getFullYear()} MyFiestagram</p>
        <p className="font-medium text-gray-600 mt-2">
          MyFiestagram — Bringing the world closer together, one post at a time.
        </p>
      </div>
    </div>
  );
};

export default RightSidebar;
