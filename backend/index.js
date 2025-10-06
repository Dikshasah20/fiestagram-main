import express, { urlencoded } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config({});
import cookieParser from "cookie-parser";
import connectDB from "./src/utils/db.config.js";
import UserRoute from "./src/routes/user.route.js"
import MessageRoute from "./src/routes/message.route.js";
import PostRoute from "./src/routes/post.route.js";
import { app, server  } from "./src/socket/socket.js";


app.get("/", (_, res)=>{
  return res.status(200).json({
    message: "I'm coming from backend",
    success: true,
  });
})

// MIDDLEWARES
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
const corsOptions = {
  origin: `${process.env.FRONTEND_URL}`,
  credentials: true,
}
app.use(cors(corsOptions));


// API
app.use("/api/v1/user", UserRoute)
app.use("/api/v1/message", MessageRoute)
app.use("/api/v1/post", PostRoute)


// SERVER CONNECTION
const PORT = process.env.PORT || 8000
server.listen(PORT,()=>{
  connectDB();
  console.log("server is listen on port "+PORT);
});

