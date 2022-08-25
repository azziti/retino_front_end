import { globalConsts } from "../Globals/global-const";
import { createSlice } from "@reduxjs/toolkit";
const loginSlice = createSlice({
  name: "login",
  initialState: {
      logged : null
  } ,
  reducers: {
    setLogin(state , action) {
        state.logged = action.payload;
        console.log('action payload' , action.payload)

    },

  },
});

export const { setLogin} = loginSlice.actions
export default loginSlice.reducer;
