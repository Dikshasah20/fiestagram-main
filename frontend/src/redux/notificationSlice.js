import { createSlice } from "@reduxjs/toolkit";

const notificationslice = createSlice({
  name:"realTimeNotification",
  initialState:{
    likeNotification:[],
  },
  reducers:{
    setLikeNotification: (state,action)=>{
      if(action.payload.type === "like"){
        state.likeNotification.push(action.payload);
      }
      if(action.payload.type === "dislike"){
        state.likeNotification= state.likeNotification.filter((item)=>item.userId !== action.payload.userId);
      };
    },
    resetLikeNotification:(state,action)=>{
      state.likeNotification = action.payload;
    }
  }
})

export const {setLikeNotification, resetLikeNotification} = notificationslice.actions;
export default notificationslice.reducer;