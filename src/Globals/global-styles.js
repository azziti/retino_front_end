import { StyleSheet , Platform , StatusBar } from "react-native";
import React from "react";
import { globalConsts } from "./global-const";

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  input : {
    paddingHorizontal : 15 ,
    marginVertical : 10 ,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth : 2 ,
    backgroundColor : 'transparent'

  } ,
  label : {
    textAlign : 'left' ,
    paddingHorizontal : 8 ,
    marginTop : 5 ,
    color : globalConsts.colors.greyText ,
    fontWeight : 'bold'
  } ,
  fullWidth : {
    width : '100%',
  } ,
  fullHeight : {
    height : '100%'
  } ,
  full : {
    flex : 1
  } ,
  checkBox : {
    paddingHorizontal : 25,
    marginVertical : 10 ,
    width : '100%' ,
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection : 'row'
  },
  AndroidSafeArea: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 ,
  } , 
  safeArea : {
    paddingTop:  StatusBar.currentHeight ,
  } ,
  errorText : {
    color : 'crimson' ,
    alignSelf : 'flex-start'
  }
});
