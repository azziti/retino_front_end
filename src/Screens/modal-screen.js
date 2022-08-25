import React, { useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView ,
} from "react-native";
import { globalStyles } from "../Globals/global-styles";
import { LinearGradient } from "expo-linear-gradient";
import { View, Pressable } from "react-native";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Formik } from "formik";
import InputCard from "../Components/input-card";
import Checkbox from "expo-checkbox";
import AppButton from "../Components/app-button";
import { globalConsts } from "../Globals/global-const";
import * as yup from "yup";
import AddPatientModal from "../Components/add-patient-modal";


// import  from "react-native-modal";

export default function TabOneScreen() {
  const [isModalVisible, setIsModalVisible] = useState(true);

//   const handleModal = () => setIsModalVisible(!isModalVisible);

  return (
    <View style={[]}>
      <Text style={styles.title}>Tab One</Text>
      <View style={styles.separator} />
      <Button title="button" onPress={handleModal} />
      <AddPatientModal visible={isModalVisible} setVisible={setIsModalVisible} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  text: {
    fontSize: 16,
    fontWeight: "400",
    textAlign: "center",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});

const printError = (touched, error) => {
    if (touched) {
      return (
        <View style={[{ paddingLeft: 30 }, globalStyles.fullWidth]}>
          <Text style={globalStyles.errorText}>{error}</Text>
        </View>
      );
    }
  };
