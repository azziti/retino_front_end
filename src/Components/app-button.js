import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";

export default function AppButton({
  onPress,
  title,
  upperCase,
  bgColor,
  fontColor,
  bdrColor,
  elevation
}) {
  return (
    <TouchableOpacity
      activeOpacity={.6}
      onPress={onPress}
      style={[
        styles.appButtonContainer,
        { backgroundColor: bgColor ? bgColor : "#fff" },
        { borderColor: bdrColor ? bdrColor : "#000" },
        { elevation : elevation ? 3 : 0}
      ]}
    >
      <Text
        style={[
          styles.appButtonText,
          upperCase && { textTransform: "uppercase" },
          { color: fontColor ? fontColor : "#000" },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  appButtonContainer: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: "90%",
    borderWidth: 2,
    alignSelf : 'center'
  },
  appButtonText: {
    fontSize: 17,
    fontWeight: "bold",
    alignSelf: "center",
  },
});
