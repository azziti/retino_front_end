import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import React, { useState } from "react";
import { globalStyles } from "../Globals/global-styles";
import { globalConsts } from "../Globals/global-const";

export default function DateInputCard({
  label,
  handleChange,
  handleBlur,
  dayValue , 
  monthValue ,
  yearValue ,
  dayName ,
  monthName ,
  yearName ,
  bdrColor,
}) {

  return (
    <View style={styles.card}>
      <Pressable>
        <Text
          style={[globalStyles.label, globalStyles.fullWidth, { fontSize: 15 }]}
        >
          {label}
        </Text>
      </Pressable>
      <View
        style={[
          styles.input,
          //   {
          //     borderBottomColor: bdrColor
          //       ? bdrColor
          //       : globalConsts.colors.helperGray,
          //   },
        ]}
      >
        <TextInput
          onChangeText={handleChange && handleChange(dayName)}
          onBlur={handleBlur && handleBlur(dayName)}
          value={dayValue && dayValue}
          textAlign="left"
          style={{
            marginHorizontal: 4,
            flex: 1,
            height: 50,
            // textAlignVertical: lines ? "top" : "center",

            borderBottomColor: bdrColor
              ? bdrColor
              : globalConsts.colors.helperGray,
            borderBottomWidth: 2,
          }}
          placeholder="jour"
          keyboardType="numeric"
        />
        <TextInput
          onChangeText={handleChange && handleChange(monthName)}
          onBlur={handleBlur && handleBlur(monthName)}
          value={monthValue && monthValue}
          textAlign="left"
          style={{
            marginHorizontal: 4,
            flex: 1,
            height: 50,
            // textAlignVertical: lines ? "top" : "center",

            borderBottomColor: bdrColor
              ? bdrColor
              : globalConsts.colors.helperGray,
            borderBottomWidth: 2,
          }}
          placeholder="mois"
          keyboardType="numeric"
        />
        <TextInput
          onChangeText={handleChange && handleChange(yearName)}
          onBlur={handleBlur && handleBlur(yearName)}
          value={yearValue && yearValue}
          textAlign="left"
          style={{
            marginHorizontal: 4,
            flex: 2,
            height: 50,
            // textAlignVertical: lines ? "top" : "center",

            borderBottomColor: bdrColor
              ? bdrColor
              : globalConsts.colors.helperGray,
            borderBottomWidth: 2,
          }}
          placeholder="années"
          keyboardType="numeric"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "90%",
  },
  input: {
    paddingHorizontal: 15,
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    justifyContent: "space-between",
  },
});
