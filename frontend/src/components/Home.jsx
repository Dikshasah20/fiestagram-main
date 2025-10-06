import { Outlet } from "react-router-dom"
import Feed from "./Feed"
import RightSidebar from "./RightSidebar"
import useGetAllPost from "@/customHooks/useGetAllPost"
import useGetSuggesteUsers from "@/customHooks/useGetSuggestedUsers"


const Home = () => {

  useGetAllPost();
  useGetSuggesteUsers();

  return (
    <div className=" flex">
      <div className="md:w-full lg:w-auto lg:mx-16 lg:pl-7 flex-grow">
        <Feed />
        <Outlet />
      </div>
      <RightSidebar />
    </div>
  )
}

export default Home