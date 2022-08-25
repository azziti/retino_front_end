import { configureStore } from '@reduxjs/toolkit';
import imagesReducer from '../Reducers/images-reducer';
import launchReducer from '../Reducers/launch-reducer';
import tokenReducer from '../Reducers/token-reducer';
import userDetailsReducer from '../Reducers/user-details-reducer';
import loginReducer from '../Reducers/authentication-reducer';


export const store = configureStore({
  reducer: {
    images: imagesReducer ,
    token : tokenReducer ,
    user : userDetailsReducer ,
    login : loginReducer ,
    launch : launchReducer
  }
});