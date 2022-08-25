import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { globalConsts } from "../Globals/global-const";

const LoadingPage = () => (
  <View style={[styles.container, styles.horizontal]}>
    <ActivityIndicator size="large" color={globalConsts.colors.primaryColor} />
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        marginTop: 12,
        minWidth: 50,
      }}
    >
      <Text style={[styles.text]}>en cours de traitement</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  horizontal: {
    // flexDirection: "row",
    justifyContent: "center",
    padding: 10,
    flexDirection: "column",
  },
  text: {
    justifyContent: "center",
    color: globalConsts.colors.primaryColor,
    fontSize: 14,
    fontWeight: "900",
  },
});

export default LoadingPage;
