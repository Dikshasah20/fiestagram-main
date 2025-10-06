import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/redux/postSlice";


const useGetAllPost = ()=>{
  const dispatch = useDispatch();
  const {token} = useSelector((store) => store.auth);

  useEffect(()=>{
    const fetchAllPost = async()=>{
      try {
        // const response = await axios.get(`${ApiUrl}/post/all`,
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/post/all`,
          {
            headers: {
              "Authorization": `Bearer ${token}`
            },
            withCredentials: true}
        )
        console.log(response.data);
        if(response.data.success){
          dispatch(setPosts(response.data.posts))
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchAllPost();
  },[])
}

export default useGetAllPost;