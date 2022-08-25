import React, { useState } from "react";
import { Modal, TouchableOpacity, ScrollView } from "react-native";
import { globalStyles } from "../Globals/global-styles";
import { View, Pressable, Text } from "react-native";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Formik } from "formik";
import InputCard from "../Components/input-card";
import AppButton from "../Components/app-button";
import { globalConsts } from "../Globals/global-const";
import * as yup from "yup";
import { RadioButton } from "react-native-paper";
import DateInputCard from "./date-input-component";

export default function AddPatientModal({ visible, setVisible , submit }) {
  const signUpSchema = yup.object({
    prenom: yup
      .string("le prenom doit être une chaîne de caractères")
      .required("le prenom est obligatoire"),
    nom: yup
      .string("le nom doit être une chaîne de caractères")
      .required("le nom est obligatoire"),
    cin: yup
      .string("le cin doit être une chaîne de caractères") ,
      // .required("le cin est obligatoire"),
    tel: yup
      .string()
      .matches(/^\d+$/, "doit être un numéro")
      .required("ce champs est obligatoire"),
    sexe: yup
      .string()
      .required("le sexe est obligatoire")
      .oneOf(["homme", "femme"], "le sexe peut être soit homme soit femme"),
    est_diabetique: yup
      .string()
      .required("vous devez specifier une valeur")
      .oneOf(["oui" , "non"], "cette valeur peut être soit oui soit non"),
    day: yup
      .string()
      .matches(/^\d+$/, "doit être un numéro"),
      // .required("le jour est obligatoire"),
    month: yup
      .string()
      .matches(/^\d+$/, "doit être un numéro"),
      // .required("le mois est obligatoire"),
    year: yup
      .string()
      .matches(/^\d+$/, "doit être un numéro"),
      // .required("l'annee est obligatoire"),
  });

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
              height: "85%",
              backgroundColor: globalConsts.colors.secondaryColor,
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
            },
          ]}
        >
          <TouchableWithoutFeedback style={[globalStyles.fullWidth]}>
            <View style={[{ flex: 1 }]}>
              <View style={[{ alignSelf: "flex-end", margin: 12 }]}>
                <TouchableOpacity onPress={handleModal}>
                  <Ionicons name="close" size={26} color="#000" />
                </TouchableOpacity>
              </View>
              <View style={[{ flex: 1 }]}>
                <ScrollView
                  style={globalStyles.full}
                  contentContainerStyle={{
                    paddingTop: 20,
                    paddingBottom: 20,
                  }}
                >
                  <View style={globalStyles.full}>
                    <Formik
                      validationSchema={signUpSchema}
                      initialValues={{
                        prenom: "",
                        nom: "",
                        cin : "" ,
                        tel: "",
                        sexe: "",
                        est_diabetique : "" ,
                        day : '' ,
                        month : '' ,
                        year : ''
                      }}
                      onSubmit={(values, actions) => submit(values)}
                    >
                      {({
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        values,
                        errors,
                        touched,
                        setFieldValue,
                      }) => (
                        <View
                          style={[
                            globalStyles.fullWidth,
                            {
                              alignItems: "center",
                              justifyContent: "center",
                              marginBottom: 20,
                            },
                          ]}
                        >
                          <View
                            style={[
                              globalStyles.fullWidth,
                              {
                                alignItems: "center",
                                justifyContent: "center",
                              },
                            ]}
                          >
                            <InputCard
                              name="nom"
                              value={values.nom}
                              handleBlur={handleBlur}
                              handleChange={handleChange}
                              placeholder="Nom"
                              label="Nom"
                            />
                            {printError(touched.nom, errors.nom)}
                          </View>
                          <View
                            style={[
                              globalStyles.fullWidth,
                              {
                                alignItems: "center",
                                justifyContent: "center",
                              },
                            ]}
                          >
                            <InputCard
                              name="prenom"
                              value={values.prenom}
                              handleBlur={handleBlur}
                              handleChange={handleChange}
                              placeholder="Prenom"
                              label="Prenom"
                            />
                            {printError(touched.prenom, errors.prenom)}
                          </View>
                          <View
                            style={[
                              globalStyles.fullWidth,
                              {
                                alignItems: "center",
                                justifyContent: "center",
                              },
                            ]}
                          >
                            <InputCard
                              name="cin"
                              value={values.cin}
                              handleBlur={handleBlur}
                              handleChange={handleChange}
                              placeholder="Cd727371"
                              label="CIN"
                            />
                            {printError(touched.cin, errors.cin)}
                          </View>
                          <View
                            style={[
                              globalStyles.fullWidth,
                              {
                                alignItems: "center",
                                justifyContent: "center",
                              },
                            ]}
                          >
                            <InputCard
                              name="tel"
                              value={values.tel}
                              handleBlur={handleBlur}
                              handleChange={handleChange}
                              placeholder="0682848382"
                              label="Telephone"
                              type="numeric"
                            />
                            {printError(touched.tel, errors.tel)}
                          </View>
                          <View
                            style={[
                              globalStyles.fullWidth,
                              {
                                alignItems: "center",
                                justifyContent: "center",
                              },
                            ]}
                          >
                            <View style={{ width: "90%" }}>
                              <Pressable>
                                <Text
                                  style={[
                                    globalStyles.label,
                                    globalStyles.fullWidth,
                                    { fontSize: 15 , marginBottom : 10 },
                                  ]}
                                >
                                  Sexe
                                </Text>
                              </Pressable>
                              <Pressable
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  paddingLeft : 10
                                }}
                              >
                                <RadioButton
                                  color={globalConsts.colors.primaryColor}
                                  value="homme"
                                  status={
                                    values.sexe === "homme"
                                      ? "checked"
                                      : "unchecked"
                                  }
                                  onPress={() => setFieldValue("sexe", "homme")}
                                />
                                <Text
                                  style={{
                                    color: globalConsts.colors.greyText,
                                    fontWeight: "bold",
                                    fontSize: 15,
                                  }}
                                >
                                  homme
                                </Text>
                              </Pressable>
                              <Pressable
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  paddingLeft : 10
                                }}
                              >
                                <RadioButton
                                  color={globalConsts.colors.primaryColor}
                                  value="femmm"
                                  status={
                                    values.sexe === "femme"
                                      ? "checked"
                                      : "unchecked"
                                  }
                                  onPress={() => setFieldValue("sexe", "femme")}
                                />
                                <Text
                                  style={{
                                    color: globalConsts.colors.greyText,
                                    fontWeight: "bold",
                                    fontSize: 15,
                                  }}
                                >
                                  femme
                                </Text>
                              </Pressable>
                            </View>
                            {printError(touched.sexe, errors.sexe)}
                          </View>
                          <View
                            style={[
                              globalStyles.fullWidth,
                              {
                                alignItems: "center",
                                justifyContent: "center",
                              },
                            ]}
                          >
                            <View style={{ width: "90%" }}>
                              <Pressable>
                                <Text
                                  style={[
                                    globalStyles.label,
                                    globalStyles.fullWidth,
                                    { fontSize: 15 , marginBottom : 10 },
                                  ]}
                                >
                                  Diabète
                                </Text>
                              </Pressable>
                              <Pressable
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  paddingLeft : 10
                                }}
                              >
                                <RadioButton
                                  color={globalConsts.colors.primaryColor}
                                  value="oui"
                                  status={
                                    values.est_diabetique === "oui"
                                      ? "checked"
                                      : "unchecked"
                                  }
                                  onPress={() => setFieldValue("est_diabetique", "oui")}
                                />
                                <Text
                                  style={{
                                    color: globalConsts.colors.greyText,
                                    fontWeight: "bold",
                                    fontSize: 15,
                                  }}
                                >
                                  oui
                                </Text>
                              </Pressable>
                              <Pressable
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  paddingLeft : 10
                                }}
                              >
                                <RadioButton
                                  color={globalConsts.colors.primaryColor}
                                  value="non"
                                  status={
                                    values.est_diabetique === "non"
                                      ? "checked"
                                      : "unchecked"
                                  }
                                  onPress={() => setFieldValue("est_diabetique", "non")}
                                />
                                <Text
                                  style={{
                                    color: globalConsts.colors.greyText,
                                    fontWeight: "bold",
                                    fontSize: 15,
                                  }}
                                >
                                  non
                                </Text>
                              </Pressable>
                            </View>
                            {printError(touched.est_diabetique, errors.est_diabetique)}
                          </View>
                          <View
                            style={[
                              globalStyles.fullWidth,
                              {
                                alignItems: "center",
                                justifyContent: "center",
                              },
                            ]}
                          >
                            <DateInputCard
                              dayName="day"
                              yearName="year"
                              monthName="month"
                              dayValue={values.day}
                              monthValue={values.month}
                              yearValue={values.year}
                              handleBlur={handleBlur}
                              handleChange={handleChange}
                              label="Date de naissance"
                            />
                            {errors.day && printError(touched.day, errors.day)}
                            {errors.month && printError(touched.month, errors.month)}
                            {errors.year && printError(touched.year, errors.year)}

                          </View>
                          <View
                            style={[{ marginTop: 30 }, globalStyles.fullWidth]}
                          >
                            <AppButton
                              title="Ajouter"
                              bgColor={globalConsts.colors.primaryColor}
                              bdrColor={globalConsts.colors.primaryColor}
                              fontColor="#fff"
                              onPress={handleSubmit}
                            />
                          </View>
                        </View>
                      )}
                    </Formik>
                  </View>
                </ScrollView>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </Modal>
  );
}

const printError = (touched, error) => {
  if (touched) {
    return (
      <View style={[{ paddingLeft: 30 }, globalStyles.fullWidth]}>
        <Text style={globalStyles.errorText}>{error}</Text>
      </View>
    );
  }
};
