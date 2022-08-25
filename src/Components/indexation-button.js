import { View, Text , StyleSheet , Pressable } from 'react-native'
import React from 'react'
import { globalConsts } from '../Globals/global-const';

export default function IndexationButton({title , value , onPress , selected}) {
  return (
    <Pressable onPress={onPress} style={[styles.button , {backgroundColor : selected === value ? globalConsts.colors.primaryColor : globalConsts.colors.secondaryColor }]}>
    <Text style={{ color  : selected === value ? '#fff' : '#000' }}>{title}</Text>
  </Pressable>
  )
}

const styles = StyleSheet.create({
    button : {
        borderColor: globalConsts.colors.greyText,
        borderRightWidth: 0.4,
        borderLeftWidth : 0.4 ,
        flex:1 , 
        minHeight : 40 ,
        justifyContent : 'center' ,
        alignItems : 'center'
      }
});