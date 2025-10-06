import Message from "../models/message.model.js"
import Conversation from "../models/conversation.model.js"
import { getRecieverSocketId, io } from "../socket/socket.js";

export const sendMessage = async(req, res) => {
  console.log("send messge initiated!")
  try {
    const senderId = req.id;
    const recieverId = req.params.id;
    let {textMsg: message} = req.body;
    console.log("backend msgTxt", message)
    message = message?.trim();
    if(!message){
      return res.status(400).json({
        success: false,
        message: "message not found"
      })
    }

    let conversation = await Conversation.findOne({
      participants: {$all: [senderId, recieverId]} 
    });
    if (!conversation) {
        //establish conversation
        conversation = await Conversation.create({
        participants: [senderId, recieverId]
      })
    }

    const newMessage = await Message.create({
      senderId,
      recieverId,
      message,
    })
    if(newMessage) conversation.messages.push(newMessage._id);
    // await conversation.save();
    // await newMessage.save();
    // above we save one by one, but using promise we can save all together
    await Promise.all([conversation.save(), newMessage.save()]);


    // implement socket.io for realtime data transfer
    const receiverSocketId = getRecieverSocketId(recieverId);
    if(receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    console.log("send messge completed!")
    return res.status(201).json({
      success: true,
      newMessage,
    })

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: "Internal server error",
      success: false,
    })
  }
}

export const getMessage = async(req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const conversation = await Conversation.findOne({
      participants:{$all: [senderId, receiverId]},
      // ! participants:{$all: [senderId, receiverId]|| [reciverId, senderId]}, 
    }).populate("messages");
    if(!conversation) {
      return res.status(200).json({
        success:true,
        messages:[],
      })
    }
    return res.status(200).json({
      success:true,
      messages: conversation?.messages,
    })

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: "Internal server error",
      success: false,
    })
  }
}