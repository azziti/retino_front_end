import { globalConsts } from "../Globals/global-const";
import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
      user : {} 
  } ,
  reducers: {
    setUser(state , action) {
        state.user = action.payload;
        console.log('token value' , action.payload)

    },

  },
});

export const { setUser } = userSlice.actions
export default userSlice.reducer;

