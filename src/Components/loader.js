import React, { useState } from "react";
import { ActivityIndicator, Dimensions, Modal, StyleSheet } from "react-native";
import { globalStyles } from "../Globals/global-styles";
import { View, Text } from "react-native";
import { globalConsts } from "../Globals/global-const";
export default function LoaderModal({ visible }) {
  return (
    <Modal animationType="fade" visible={visible} transparent={true}>
      <View
        style={[
          globalStyles.full,
          {
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0 , 0 , 0 , 0.4)",
          },
        ]}
      >
        <View style={[styles.container]}>
          <ActivityIndicator
            size="large"
            color={globalConsts.colors.primaryColor}
          />
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
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("window").width - 40,
    flex: 1,
    maxHeight: 250,
    backgroundColor: globalConsts.colors.secondaryColor,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    justifyContent: "center",
    color: globalConsts.colors.primaryColor,
    fontSize: 14,
    fontWeight: "900",
  },
});
