import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useState, useEffect } from "react";
import AuthStackRouter from "./auth-stack-router";
import EntryRouter from "./entry-router";
import { useDispatch, useSelector } from "react-redux";
import { setLogin } from "../Reducers/authentication-reducer";
import { getItem, saveItem } from "../Services/store-service";
import { globalConsts } from "../Globals/global-const";
import LoadingPage from "../Screens/loading-screen";

const Stack = createNativeStackNavigator();

export default function AppRouter() {
  const dispatch = useDispatch();
  const reduxLogin = useSelector((state) => {
    return state.login.logged;
  });

  useEffect(() => {
    (async () => {
      if (reduxLogin === null) {
        const status = await getItem(globalConsts.alias.LOGIN);
        // status == null ? setLaunched(false) : setLaunched(true);
        if (status === true) {
          dispatch(setLogin(true));
          saveItem(globalConsts.alias.LAUNCHED, true);
        } else {
          dispatch(setLogin(false));
          saveItem(globalConsts.alias.LAUNCHED, false);
        }
      }
    })();
  }, []);

  const content = () => {
    if (reduxLogin != null) {
      return reduxLogin === false ? (
        <Stack.Screen name="Auth" component={AuthStackRouter} />
      ) : (
        <Stack.Screen name="Entry" component={EntryRouter} />
      );
    } else {
      return <Stack.Screen name="Loader" component={LoadingPage} />;
    }
  };

  // return (
  //   <Stack.Navigator
  //       // initialRouteName='Login'
  //     screenOptions={{
  //       headerShown: false,
  //     }}
  //   >
  //     <Stack.Screen name="Auth" component={AuthStackRouter} />
  //     <Stack.Screen name="Entry" component={EntryRouter} />
  //   </Stack.Navigator>
  // );
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {content()}
    </Stack.Navigator>
  );
}
