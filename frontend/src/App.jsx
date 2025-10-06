import Login from './components/Login'
import MainLayout from './components/MainLayout';
import Signup from './components/Signup'
import { createBrowserRouter, RouterProvider, useNavigate } from 'react-router-dom';
import Profile from './components/Profile';
import Home from './components/Home';
import "./App.css";
import EditProfile from './components/EditProfile';
import ChatPage from './components/ChatPage';
import { io } from 'socket.io-client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSocket } from './redux/socketSlice';
import { setOnlineUsers } from './redux/chatSlice';
import { setSelectedUser } from './redux/authSlice';
import { setLikeNotification } from './redux/notificationSlice';
import ProtectedRoutes from './components/ProtectedRoutes';


const browserRouter = createBrowserRouter([
  {
    path: "/",
    element:<ProtectedRoutes><MainLayout /></ProtectedRoutes>,
    children: [
      {
        path: "/",
        element: <ProtectedRoutes><Home /></ProtectedRoutes>
      },
      {
        path: "/profile/:id",
        element: <ProtectedRoutes><Profile /></ProtectedRoutes> 
      },
      {
        path: "/account/edit",
        element: <ProtectedRoutes><EditProfile /></ProtectedRoutes>
      },
      {
        path: "/chat",
        element:<ProtectedRoutes><ChatPage /></ProtectedRoutes> 
      },
    ]
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/signup",
    element: <Signup />
  },
]);




function App() {
  const { user } = useSelector((store) => store.auth);
  const {socket} = useSelector((store)=>store.socketio);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSelectedUser(null));

    if (user) {
      const socketio = io(`${import.meta.env.VITE_WEB_SOCKET_URL}`, {
        query: {
          userId: user._id,
        },
        transports: ['websocket']
      });
      dispatch(setSocket(socketio));

      //listen event all events of socket
      socketio.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      })

      // listen event for notifications
      socketio.on("notification", (notifications) => {
        dispatch(setLikeNotification(notifications));
      })

      // cleanup - when user leave this page
      return () => {
        socketio.close();
        dispatch(setSocket(null));
      }
    }
    else if(socket) {
      socket?.close();
      dispatch(setSocket(null));
    }

  }, [user, dispatch])

  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  )
}

export default App
