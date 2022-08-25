import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";
import { globalConsts } from "../Globals/global-const";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function Header({ title, bgColor, textColor, onBackPress }) {
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: bgColor ? bgColor : globalConsts.colors.primaryColor,
          flexDirection: "row",
          justifyContent: onBackPress != null ? "space-between" : "center",
        },
      ]}
    >
      {onBackPress && (
        <View style={{ width: 50 }}>
          <Pressable style={{ flex: 1 }} onPress={onBackPress}>
            <Ionicons
              name="arrow-back-outline"
              size={22}
              style={{
                margin: 9,
                color: textColor
                  ? textColor
                  : globalConsts.colors.secondaryColor,
              }}
            />
          </Pressable>
        </View>
      )}

      <Text
        style={[
          styles.text,
          { color: textColor ? textColor : globalConsts.colors.secondaryColor },
        ]}
      >
        {title ? title : "Header"}
      </Text>

      {onBackPress && <View style={{ width: 50 }}></View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    width: "100%",
    justifyContent: "center",
  },
  text: {
    alignSelf: "center",
    fontSize: 17,
    fontWeight: "bold",
  },
});
