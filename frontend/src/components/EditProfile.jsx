import React, { useRef, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import axios from 'axios'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { setAuthUser } from '@/redux/authSlice'


const EditProfile = () => {
  const { user } = useSelector((store) => store.auth);
  const imageRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    profilePhoto: null, 
    bio: user?.bio,
    gender: user?.gender,
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {token} = useSelector((state) => state.auth);

  const fileChangeHandler = (e)=>{
    const file = e.target.files?.[0];
    if(file){
      setInput({...input, profilePhoto:file});
    }
  }
  
  const selectChangeHandler = (value)=>{
    setInput({...input, gender:value});
  }
  const EditProfileHandler = async() => {
    console.log("inputs ", input);
    const formData = new FormData();
    if(input.profilePhoto) formData.append("profilePhoto", input.profilePhoto);
    if(input.gender) formData.append("gender", input.gender);
    if(input.bio) formData.append("bio", input.bio);
    console.log("formdata ", formData);
    try {
      setLoading(true);
      console.log("inputvals", input);
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/user/profile/edit`,
        formData,
        {
          headers:{
            'Content-Type': 'multipart/form-data',
            "Authorization": `Bearer ${token}`
          },
          withCredentials: true,
        }
      )
      if(res.data.success){
        toast.success(res.data.message);
        const updatedUserData = {
          ...user,
          bio: res.data.user?.bio,
          gender: res.data.user?.gender,
          profilePicture: res.data.user?.profilePicture,
        };
        dispatch(setAuthUser(updatedUserData));
        navigate(`/profile/${user._id}`);
      }

    } catch (error) {
      console.log(error);
      toast.error(error.res.message);
    }finally{
      setLoading(false);
    }
  }

  return (
    <div className=' flex max-w-2xl pl-10 mx-auto'>
      <section className='flex flex-col my-8 gap-6 w-full'>
        <h1 className='font-bold text-xl'>Edit Profile</h1>
        <div className="flex items-center justify-between bg-gray-100 rounded-xl p-4 gap-4 mb-6">
          <div className='flex items-center gap-3'>
            <Avatar className="hover:outline hover:outline-blue-500">
              <AvatarImage src={user?.profilePicture || ""} alt={`profile`} />
              <AvatarFallback className="font-semibold bg-gray-200">
                {user?.username?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col justify-start">
              <h1 className="font-bold text-sm">{user?.username}</h1>
              <span className="text-sm text-gray-600">{user?.bio || "Add a bio to let others know more about you!"}</span>
            </div>
          </div>
          <input onChange={fileChangeHandler} ref={imageRef} type="file" className='hidden' name="" id="" />
          <Button onClick={() => imageRef?.current.click()} className="hover:bg-[#42a2e3] bg-[#0095F6] h-8 rounded-[8px] text-white">Change photo</Button>
        </div>
        <div>
          <h1 className='mb-2 font-bold text-lg'>Bio</h1>
          <Textarea value={input?.bio} onChange={(e)=>setInput({...input, bio:e.target.value})} name="bio" className="focus-visible:ring-transparent rounded-[8px]" />
        </div>
        <div >
          <h1 className='font-bold mb-2'>Gender</h1>
          <Select defaultValue={input.gender} onValueChange={selectChangeHandler}>
            <SelectTrigger className="rounded-[6px] w-full">
              <SelectValue className='font-bold text-gray-300' placeholder="Choose one"/>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup className='bg-white'>
                <SelectItem className="cursor-pointer " value="male">Male</SelectItem>
                <SelectItem className="cursor-pointer " value="female">Female</SelectItem>
                <SelectItem className="cursor-pointer " value="other">Other</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className='flex justify-end'>
          {
            !loading ? (
              <Button onClick={EditProfileHandler} className="w-fit hover:bg-[#42a2e3] bg-[#0095F6] h-8 rounded-[8px] text-white"> Submit</Button>
            ):(
              <Button className="w-fit hover:bg-[#42a2e3] bg-[#0095F6] h-8 rounded-[8px] text-white">
                <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
                Please wait...
                </Button>
            )
          }
        </div>
      </section>
    </div>
  )
}

export default EditProfile