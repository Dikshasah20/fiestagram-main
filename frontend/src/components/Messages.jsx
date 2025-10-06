import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useGetAllMessages from '@/customHooks/useGetAllMessages';
import useGetRTM from '@/customHooks/useGetRTM';

const Messages = ({ selectedUser }) => {
  useGetRTM();
  useGetAllMessages();
  const { messages } = useSelector((store) => store.chat);
  const { user } = useSelector((store) => store.auth);
  if (!selectedUser) return null;


  return (
    <div className='overflow-y-auto flex-1 p-4'>
      <div className='flex justify-center'>
        <div className='flex flex-col items-center justify-center'>
          <Avatar className="h-20 text-2xl w-20  bg-gray-100 rounded-full">
            <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
            <AvatarFallback>{selectedUser?.username?.[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <span> {selectedUser?.username}</span>
          <Link to={`/profile/${selectedUser?._id}`}><Button className="h-8 rounded-[9px] bg-gray-100 my-2 ">View profile</Button></Link>
        </div>
      </div>
      <div className='flex flex-col gap-3'>
        {
          messages && messages.map((msg, idx) => {
            return (

              <div key={idx} className={`flex flex-col-1 ${user?._id === msg.senderId ? "justify-end" : 'justify-start'}`}>
                {/* <Avatar className="h-20 text-2xl w-20  bg-gray-100 rounded-full">
                  <AvatarImage src={msg?.senderId} alt="profile" />
                  <AvatarFallback>{selectedUser?.username?.[0].toUpperCase()}</AvatarFallback>
                </Avatar> */}
                <div className={`px-3 py-2 rounded-xl  max-w-xs break-words ${user?._id === msg.senderId ? "bg-blue-500 text-white": "bg-gray-200 text-black"}`}>
                {msg.message}
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default Messages