import { globalConsts } from "../Globals/global-const";
import { createSlice } from "@reduxjs/toolkit";
const imagesSlice = createSlice({
  name: "images",
  initialState: {
      images : []
  } ,
  reducers: {
    setImages(state , action) {
        state.images = action.payload;
        console.log('action payload' , action.payload)

    },

  },
});

export const { setImages , reset } = imagesSlice.actions
export default imagesSlice.reducer;
