import { View, Text } from 'react-native'
import React from 'react'
import MaskedView from "@react-native-masked-view/masked-view";


export default function GradientText({ text }) {
  return (
    <MaskedView
    style={{ height : 50 , flexDirection: "row", width: "100%" }}
    maskElement={
      <View
        style={{
          // Transparent background because mask is based off alpha channel.
          backgroundColor: "transparent",
          height : '100%' ,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          { text }
        </Text>
      </View>
    }
  >
    {/* Shows behind the mask, you can put anything here, such as an image */}
    <View
      style={{
        flex: 1,
        height: "100%",
        backgroundColor: "#19A5D7",
      }}
    />
    <View
      style={{
        flex: 1,
        height: "100%",
        backgroundColor: "#19A5D7",
      }}
    />
    <View
      style={{
        flex: 1,
        height: "100%",
        backgroundColor: "#",
      }}
    />
    <View
      style={{
        flex: 2,
        height: "100%",
        backgroundColor: "#19A5D7",
      }}
    />
    <View
      style={{
        flex: 1,
        height: "100%",
        backgroundColor: "#566FE9",
      }}
    />
    <View
      style={{
        flex: 1,
        height: "100%",
        backgroundColor: "#804BF6",
      }}
    />
    <View
      style={{
        flex: 1,
        height: "100%",
        backgroundColor: "#566FE9"  ,
      }}
    />
    <View
      style={{
        flex: 1,
        height: "100%",
        backgroundColor: "#19A5D7",
      }}
    />
    <View
      style={{
        flex: 1,
        height: "100%",
        backgroundColor: "#19A5D7",
      }}
    />
    <View
      style={{
        flex: 1,
        height: "100%",
        backgroundColor: "#19A5D7",
      }}
    />
    <View
      style={{
        flex: 1,
        height: "100%",
        backgroundColor: "#19A5D7",
      }}
    />
    <View
      style={{
        flex: 1,
        height: "100%",
        backgroundColor: "#19A5D7",
      }}
    />

  </MaskedView>
  )
}