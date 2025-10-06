import { setUserProfile } from "@/redux/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";


const useGetUserProfile = (userId)=>{
  const dispatch = useDispatch();
  const {token} = useSelector((state) => state.auth);

  useEffect(()=>{
    const fetchUserProfile = async()=>{
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/${userId}/profile`,
          {
            headers: {
              "Authorization": `Bearer ${token}`
            },
            withCredentials: true}
        )
        if(response.data.success){
          dispatch(setUserProfile(response.data.user))
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchUserProfile();
  },[userId])
}

export default useGetUserProfile;