import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import React, { useState } from "react";
import { globalStyles } from "../Globals/global-styles";
import Ionicons from "react-native-vector-icons/Ionicons";
import { globalConsts } from "../Globals/global-const";


export default function InputCard({
  label,
  placeholder,
  password,
  type,
  handleChange,
  handleBlur,
  value,
  name,
  bdrColor,
  lines ,
  iconColor
}) {
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [rightIcon, setRightIcon] = useState("eye-outline");

  const handlePasswordVisibility = () => {
    if (rightIcon === "eye-outline") {
      setRightIcon("eye-off-outline");
      setPasswordVisibility(false);
    } else if (rightIcon === "eye-off-outline") {
      setRightIcon("eye-outline");
      setPasswordVisibility(true);
    }
  };

  return (
    <View style={styles.card}>
      <Pressable > 
        <Text style={[globalStyles.label, globalStyles.fullWidth , { fontSize: 15  }]}>{label}</Text>
      </Pressable>
      <View
        style={[
          globalStyles.input ,
          {
            borderBottomColor : bdrColor ?  bdrColor : globalConsts.colors.helperGray ,
 
          }
        ]}
      >
        <TextInput
          multiline={lines ? true : false }
          numberOfLines={lines ? lines : 1}
          onChangeText={handleChange && handleChange(name)}
          onBlur={handleBlur && handleBlur(name)}
          value={value && value}
          textAlign="left"
          style={{ flex: 1 , height : lines ? null : 50 , textAlignVertical: lines ? 'top' : 'center'  }}
          placeholder={placeholder}
          secureTextEntry={password ? passwordVisibility : false}
          keyboardType={type ? type : "default"}
        />

        {(() => {
          if (password) {
            return (
              <Pressable onPress={handlePasswordVisibility}>
                <Ionicons color={iconColor ? iconColor : globalConsts.colors.primaryColor } name={rightIcon} size={22}  />
              </Pressable>
            );
          }
        })()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "90%",
    // marginTop: 10,
  },
});
