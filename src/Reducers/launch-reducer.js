import { globalConsts } from "../Globals/global-const";
import { createSlice } from "@reduxjs/toolkit";
const launchSlice = createSlice({
  name: "launch",
  initialState: {
      launched : null
  } ,
  reducers: {
    setLaunch(state , action) {
        state.launched = action.payload;
        console.log('action payload' , action.payload)

    },

  },
});

export const { setLaunch} = launchSlice.actions
export default launchSlice.reducer;