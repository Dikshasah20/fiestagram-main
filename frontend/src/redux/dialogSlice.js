import { createSlice } from "@reduxjs/toolkit";

const dialogSlice = createSlice({
  name: "dialog",
  initialState:{
    isOpen: false,
  },
  reducers: {
    setIsOpen:(state, action) => {
      state.isOpen = action.payload;
    }
  }
});

export const {setIsOpen} = dialogSlice.actions;
export default dialogSlice.reducer;