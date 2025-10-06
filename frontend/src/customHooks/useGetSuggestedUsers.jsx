import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSuggestedUsers } from "@/redux/authSlice";

const useGetSuggesteUsers = ()=>{
  const dispatch = useDispatch();
  const {token} = useSelector((store)=> store.auth);

  useEffect(()=>{
    const fetchSuggestedUsers = async()=>{
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/suggested`,
          {
            headers: {
              "Authorization": `Bearer ${token}`
            },
            withCredentials: true}
        )
        if(response.data.success){
          dispatch(setSuggestedUsers(response.data.users))
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchSuggestedUsers();
  },[])
}

export default useGetSuggesteUsers;