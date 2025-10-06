import {Server} from "socket.io";
import express from "express";
import http from "http";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods:["GET", "POST"],
  }
});

// this map(hashMap) stores the corresponding userId to identify user, associated with userId eg.-> { userId: socketId}
const userSocketMap = {};

export const getRecieverSocketId = (recieverId)=> userSocketMap[recieverId];


io.on("connection", (socket)=>{
  const userId = socket.handshake.query.userId;
  if(userId){
    userSocketMap[userId] = socket.id;
    console.log(`User connected, userId: ${userId} && socketId: ${socket.id}`)
  }
  
  io.emit("getOnlineUsers", Object.keys(userSocketMap)); 

  socket.on("disconnect", ()=>{
    if(userId){
      delete userSocketMap[userId];
      console.log(`User disConnected, userId: ${userId} && socketId: ${socket.id}`)
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  })
})

export {app, server, io}