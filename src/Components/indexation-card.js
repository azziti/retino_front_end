import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import React from "react";
import { globalConsts } from "../Globals/global-const";
import { globalStyles } from "../Globals/global-styles";

export default function IndexationCard({ onPress, data }) {
  return (
    <TouchableOpacity
      style={[styles.card]}
      // onPress={() => navigate("DetailsPatient")}
    >
      <View
        style={[
          {
            flexDirection: "column",
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderBottomColor: globalConsts.colors.greyText,
            borderBottomWidth: 0.4,
          },
        ]}
      >
        <View style={[globalStyles.full, { flexDirection: "row" }]}>
          <View>
            <Image
              style={[styles.image]}
              source={require("../../assets/examination.png")}
            />
          </View>
          <View style={[{ flex: 1, marginStart: 20 }]}>
            <View
              style={[
                {
                  paddingTop: 10,
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                },
              ]}
            >
              <Ionicons
                name="time-outline"
                size={16}
                color={globalConsts.colors.greyText}
                style={{ marginRight: 6 }}
              />
              <Text style={[styles.text]}>Date : </Text>
              <Text style={[styles.blackText]}>{data.date_acquisition}</Text>
            </View>
            <View
              style={[
                {
                  paddingTop: 10,
                  flexDirection: "row",
                  justifyContent: "flex-start",
                },
              ]}
            >
              <Ionicons
                name="eye-outline"
                size={16}
                color={globalConsts.colors.greyText}
                style={{ marginRight: 6 }}
              />
              <Text style={[styles.text]}>Oeil : </Text>
              <Text style={[styles.blackText]}>
                {data.eye == null
                  ? "Non defini"
                  : data.eye == "RIGHT"
                  ? "OD"
                  : "OG"}
              </Text>
            </View>
            {data.id != null && (
              <View
                style={[
                  {
                    paddingTop: 10,
                    flexDirection: "row",
                    justifyContent: "flex-start",
                  },
                ]}
              >
                <Ionicons
                  name="person-outline"
                  size={16}
                  color={globalConsts.colors.greyText}
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.text]}>Id : </Text>
                <Text style={[styles.blackText]}>
                  {data.id != null
                    ? "Non defini"
                    : data.id.length <= 13 ? data.id : data.id.split('/').slice(-2,-1).pop()
                    // == "RIGHT"
                    // ? "OD"
                    // : "OG"
                    //
                    }
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
      <View
        style={[
          {
            flexDirection: "row",
            paddingVertical: 7,
            paddingHorizontal: 20,
            justifyContent: "flex-end",
          },
        ]}
      >
        <View>
          <TouchableOpacity
            style={[{ flexDirection: "row", alignItems: "center" }]}
            onPress={onPress}
          >
            <Text style={[styles.button]}>Voir</Text>
            <Ionicons
              name="arrow-forward-outline"
              size={18}
              color={globalConsts.colors.primaryColor}
              style={{ marginStart: 6 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 5,
    borderRadius: 15,
    backgroundColor: globalConsts.colors.secondaryColor,
    borderColor: globalConsts.colors.greyText,
    borderWidth: 0.4,
  },
  image: {
    width: 50,
    height: 50,
  },
  header: {
    fontSize: 19,
    fontWeight: "bold",
    marginBottom: 5,
  },
  text: {
    fontSize: 12,
    color: globalConsts.colors.greyText,
    fontWeight: "bold",
    marginStart: 5,
  },
  blackText: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#000",
  },
  button: {
    color: globalConsts.colors.primaryColor,
    fontWeight: "bold",
    fontSize: 15,
  },
});
