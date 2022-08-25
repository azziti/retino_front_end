import { LogBox, StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import MainRouter from "./src/Routes/main-router";
import { Provider } from "react-redux";
import { store } from "./src/Configuration/store-configuration";
import TestScreen from "./src/Screens/test-screen";
import LoadingPage from "./src/Screens/loading-screen";
import NetInfo from '@react-native-community/netinfo';
// import * as MediaLibrary from "expo-media-library";
// import { useEffect } from "react";
// import { Asset, useAssets } from 'expo-asset';



export default function App() {
  LogBox.ignoreLogs([
    "ViewPropTypes will be removed",
    "ColorPropType will be removed",
  ]);

  // const [asset, error] = useAssets([require('./assets/eye-scan.png'), require('./assets/eye-scan.png')]);


  console.log("application started");


  NetInfo.fetch().then(state => {
    console.log('Connection type', state.type);
    console.log('Is connected?', state.isConnected);
  }).catch((erro)=>{
    console.log(error);
  });

  StatusBar.setBackgroundColor("#000");

  // useEffect(async() => {
    
  // const album = await MediaLibrary.getAlbumAsync('retinia');

  //   if (album == null) {
  //     // const asset = await MediaLibrary.createAssetAsync(require('./assets/eye-scan.png'));
  //     const cAlbum = await MediaLibrary.createAlbumAsync('retinia', asset, false);
  //   }
  // },[asset])

    // const newAsset = await MediaLibrary.getAssetInfoAsync(asset);
    // console.log('new asset' , newAsset);




  return (
    <Provider store={store}>
      <NavigationContainer>
        <MainRouter />
      </NavigationContainer>
    </Provider>
  );

  // return <TestScreen />

  // return <LoadingPage />
}
