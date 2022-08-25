import React, { useState } from "react";
import { Modal, TouchableOpacity } from "react-native";
import { globalStyles } from "../Globals/global-styles";
import { View , Text } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AppButton from "../Components/app-button";
import { globalConsts } from "../Globals/global-const";

export default function OptionsModal({ visible, setVisible , onNewPatient , onExistingPatient }) {
  const handleModal = () => setVisible(!visible);

  return (
    <Modal animationType="fade" visible={visible} transparent={true}>
      <View
        style={[
          globalStyles.full,
          {
            justifyContent: "flex-end",
            backgroundColor: "rgba(0 , 0 , 0 , 0.4)",
          },
        ]}
      >
        <View style={[{ flex: 1 }]}>
          <TouchableOpacity
            style={[globalStyles.full]}
            onPress={() => setVisible(false)}
          ></TouchableOpacity>
        </View>
        <View
          style={[
            globalStyles.fullWidth,
            {
            //   flex : 1 ,
              minHeight: '35%',
              backgroundColor: globalConsts.colors.secondaryColor,
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
            },
          ]}
        >
          <View style={[{ flex: 1  }]}>
            <View style={[{ margin: 12, marginBottom: 0 }]}>
              <TouchableOpacity
                onPress={handleModal}
                style={[{ alignSelf: "flex-end" }]}
              >
                <Ionicons name="close" size={26} color="#000" />
              </TouchableOpacity>
              <Text
                style={[
                  {
                    alignSelf: "center",
                    fontSize: 17,
                    fontWeight: "bold",
                    marginTop: 0,
                  },
                ]}
              >
                Choisir un patient
              </Text>
            </View>
            <View style={[globalStyles.container]}>
              <View style={[{ marginBottom: 10 , minHeight : 50 }, globalStyles.fullWidth]}>
                <AppButton
                  title="Nouveau Patient"
                  bgColor={globalConsts.colors.primaryColor}
                  bdrColor={globalConsts.colors.primaryColor}
                  fontColor="#fff"
                  onPress={onNewPatient}
                />
              </View>

              <View style={[{ marginBottom: 10 ,  minHeight : 50 }, globalStyles.fullWidth]}>
                <AppButton
                  title="Patient existant"
                  bgColor={globalConsts.colors.primaryColor}
                  bdrColor={globalConsts.colors.primaryColor}
                  fontColor="#fff"
                  onPress={onExistingPatient}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
