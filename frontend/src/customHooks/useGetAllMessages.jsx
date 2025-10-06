import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "@/redux/chatSlice";


const useGetAllMessages = ()=>{
  const dispatch = useDispatch();
  const {selectedUser, token} = useSelector((store)=>store.auth);

  useEffect(()=>{
    const fetchAllMessages = async()=>{
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/message/all/${selectedUser?._id}`,
          {
            headers:{
              "Authorization": `Bearer ${token}`,
            },
            withCredentials: true
          }
        )
        console.log(response.data);
        if(response.data.success){
          dispatch(setMessages(response.data.messages))
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchAllMessages();
  },[selectedUser])
}

export default useGetAllMessages;