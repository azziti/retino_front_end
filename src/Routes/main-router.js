import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useState, useEffect } from "react";
import AppRouter from "./app-router";
import OnboardingScreen from "../Screens/on-boarding-sccreens";
import { getItem, saveItem } from "../Services/store-service";
import { globalConsts } from "../Globals/global-const";
import { useDispatch, useSelector } from "react-redux";
import { setLaunch } from "../Reducers/launch-reducer";
import LoadingPage from "../Screens/loading-screen";
import * as FileSystem from 'expo-file-system';
const { StorageAccessFramework } = FileSystem;



const Stack = createNativeStackNavigator();

export default function MainRouter() {
  const dispatch = useDispatch();
  const reduxLaunch = useSelector((state) => {
    return state.launch.launched;
  });

  // const [launched, setLaunched] = useState(null);

  useEffect(() => {
    (async () => {
      if (reduxLaunch === null) {
        const status = await getItem(globalConsts.alias.LAUNCHED);
        // status == null ? setLaunched(false) : setLaunched(true);
        if (status === true) {
          dispatch(setLaunch(true));
          saveItem(globalConsts.alias.LAUNCHED, true);
        } else {
          dispatch(setLaunch(false));
          saveItem(globalConsts.alias.LAUNCHED, false);
        }
      }
    })();
  }, []);

  const content = () => {
    if (reduxLaunch != null) {
      return reduxLaunch === false ? (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      ) : (
        <Stack.Screen name="App" component={AppRouter} />
      );
    } else {
      return <Stack.Screen name="Loader" component={LoadingPage} />;
    }
  };


  // console.log(FileSystem.documentDirectory) ;
  // FileSystem.readDirectoryAsync('file:///storage/emulated/0/Pictures').then(res => console.log(res)).catch(err => console.log(err));
  // console.log(StorageAccessFramework.getUriForDirectoryInRoot());
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
