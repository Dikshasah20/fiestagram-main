import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { setSelectedUser } from '@/redux/authSlice';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { MessageCircleCode, Send, SmileIcon } from 'lucide-react';
import Messages from './Messages';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { setMessages } from '@/redux/chatSlice';
import EmojiPicker from 'emoji-picker-react';

const ChatPage = () => {
  const {user, selectedUser, suggestedUsers } = useSelector((store)=>store.auth);
  const {onlineUsers, messages} = useSelector((store)=>store.chat);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const dispatch = useDispatch();
  const [textMsg, setTextMsg] = useState("");
  const {token} = useSelector((state)=> state.auth);

  const sendMessageHandler = async(receiverId)=>{
    try {
      console.log("messageTxt",textMsg);
      console.log("receiverId",receiverId);
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/message/send/${receiverId}`,
        {textMsg},
        {
          headers:{
            "Content-Type":"application/json",
            "Authorization": `Bearer ${token}`
          },
          withCredentials: true
        },
      )
      if(res.data.success){
        dispatch(setMessages([...messages, res.data.newMessage]))
        setTextMsg("")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const addEmoji = (emojiObject) => {
    setTextMsg((prevText) => prevText + emojiObject.emoji); // Append selected emoji to text
  };

  const previewConfig = {
    defaultCaption: "What's your mood?",
    showPreview: false, // defaults to: true
    skinTonesDisabled: false,
  }

  useEffect(()=>{
    return ()=>{
      dispatch(setSelectedUser(null));
    }
  },[])


  return (
    <div className='flex ml-[18%] h-screen'>
      <section className=' px-2 my-7 w-full md:w-1/4'>
        <h1 className='font-bold mb-2 px-3 text-xl'>{user?.username}</h1>
        {/* <hr className='mb-4 border-gray-300'/> */}
        <div className='overflow-y-auto h-[80vh]'>
          {suggestedUsers?.map((suggestedUser)=>{
            const isOnline = onlineUsers.includes(suggestedUser?._id);
            return (
              <div key={suggestedUser?._id}
              onClick={()=> dispatch(setSelectedUser(suggestedUser))}
              className='flex gap-3 items-center p-3 hover:bg-gray-50 cursor-pointer'>
                <Avatar className='w-14 h-14 text-lg bg-gray-100 rounded-full'>
                  <AvatarImage  src={suggestedUser?.profilePicture}/>
                  <AvatarFallback>{suggestedUser?.username?.[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className='flex flex-col'>
                  <span className='font-medium'>{suggestedUser?.username}</span>
                  <span className={`text-xs font-bold ${isOnline?"text-green-600":"text-red-600"}`}>{isOnline? "online":"offline"}</span>
                </div>
              </div>
            )
          })}
        </div>
      </section>

        {
          selectedUser ?(
            <section className='flex-1 border-l border-l-gray-300 flex flex-col h-full'>
              <div className='flex items-center gap-3 px-3 py-2 border-b border-gray-300 sticky top-0 bg-white z-10'>
                <Avatar className=" bg-gray-100 rounded-full">
                <AvatarImage  src={selectedUser?.profilePicture}/>
                <AvatarFallback>{selectedUser?.username?.[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className='flex flex-col'>
                  <span>{selectedUser?.username}</span>
                </div>
              </div>
              <Messages selectedUser = {selectedUser}/> 
              {showEmojiPicker && (
                <div className=" px-12 mt-35 pt-20 absolute z-50">
                  <EmojiPicker previewConfig={previewConfig} className="text-gray-100" height="430px" onEmojiClick={addEmoji} />
                </div>
              )}

              <div className='flex items-center px-2 py-1 gap-2 border-t border-t-gray-300'>
                <div>
                  <button className="text-xl border-none outline-none" onClick={() => setShowEmojiPicker((prev) => !prev)}>
                    <SmileIcon className="hover:text-yellow-600  text-xl bg-transparent hover:cursor-pointer" />
                  </button>
                </div>
                <Input value={textMsg} onChange={(e)=>{
                  setShowEmojiPicker(false);
                  setTextMsg(e.target.value);
                }} type="text" className="flex-1 border-gray-200 rounded-[7px] m-2 focus-visible:ring-transparent" placeholder="Try to be silent..."/>
                <Send onClick={()=>sendMessageHandler(selectedUser._id)} className="mr-4 hover:cursor-pointer hover:text-blue-700  rounded-[7px] hover:shadow-xl "> Send</Send>
              </div>
            </section>
          ):(
            <div className='flex flex-col items-center justify-center mx-auto'>
              <MessageCircleCode className='w-32 h-32 my-4'/>
              <h1 className='font-medium'>Your Messages</h1>
              <span>Send a message to start a chat</span>
            </div>
          )
        }
    </div>
  )
}

export default ChatPage