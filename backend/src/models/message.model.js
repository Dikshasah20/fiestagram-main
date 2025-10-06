import mongoose from "mongoose";

const MessageSchama = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId, ref: "User",
    required: true,
  },
  recieverId: {
    type: mongoose.Schema.Types.ObjectId, ref: "User",
    required: true,
  },
  message: {
    type: String,
    required: true,
  }
});

const Message = mongoose.model("Message", MessageSchama);
export default Message;