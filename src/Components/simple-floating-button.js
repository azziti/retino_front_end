import { TouchableOpacity, Text, StyleSheet } from "react-native";
import React from "react";
import { globalConsts } from "../Globals/global-const";
import Ionicons from "react-native-vector-icons/Ionicons";


export default function FloatingButton({ iconName , onPress , bgColor , iconColor }) {
  return (
    <TouchableOpacity onPress={onPress ? onPress : null} style={[ styles.buttonContainer , { backgroundColor : bgColor ? bgColor : globalConsts.colors.primaryColor } ]}>
        <Ionicons name={iconName ? iconName : 'add'} size={28} color={iconColor ? iconColor : globalConsts.colors.secondaryColor} />
    </TouchableOpacity>
  ) ;

}

styles = StyleSheet.create({
  buttonContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: globalConsts.colors.primaryColor,
    position: "absolute",
    bottom: 10,
    right: 10,
    alignItems : 'center' ,
    justifyContent : 'center' ,
    elevation : 6

  },
});
