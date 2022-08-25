import { View, Text, ScrollView, Image, Pressable, Alert } from "react-native";
import React, { useState } from "react";
import { globalStyles } from "../Globals/global-styles";
import InputCard from "../Components/input-card";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import AppButton from "../Components/app-button";
import { globalConsts } from "../Globals/global-const";
import { Formik } from "formik";
import * as yup from "yup";
import { LinearGradient } from "expo-linear-gradient";
import Logo from "../Components/logo";
import GradientText from "../Components/gradient-text";
import { post } from "../Services/http-service";
import { Database } from "react-native-feather";
import LoaderModal from "../Components/loader";

export default function RegisterScreen({ navigation }) {
  // the Formik documentation
  // https://formik.org/docs/guides/react-native
  // the yup documentaion
  // https://github.com/jquense/yup

  // validation rules
  const signUpSchema = yup.object({
    email: yup
      .string()
      .email("Svp donner un email valide")
      .required("l'email est obligatoire"),
    prenom: yup
      .string("le prenom doit être une chaîne de caractères")
      .required("le prenom est obligatoire"),
    nom: yup
      .string("le nom doit être une chaîne de caractères")
      .required("le nom est obligatoire"),
    password: yup
      .string()
      .required("le mot de passe est obligatoire")
      .min(8, "le mot de passe doit avoir au moins 8 caractères"),
    passwordConfirmation: yup
      .string()
      .required("la confirmation du mot de passe est obligatoire")
      .min(
        8,
        "la confirmation du mot de passe doit avoir au moins 8 caractères"
      )
      .oneOf([yup.ref("password")], "les mots de passe doivent être les même"),
    numero_pattente: yup
      .string()
      .matches(/^\d+$/, "doit être un numéro") ,
      // .required("ce champs est obligatoire"),
    inpe: yup
      .string()
      .matches(/^\d+$/, "doit être un numéro") ,
      // .required("ce champs est obligatoire"),
    num_tel: yup
      .string()
      .matches(/^\d+$/, "doit être un numéro") ,
      // .required("ce champs est obligatoire"),
  });


  const displayError = () => {
    Alert.alert("Avertissement !", "problème de connexion", [
      {
        text: "Ok",
        onPress: () => { null },
        // style: "cancel"
      },
      // { text: "Annuler", onPress:() => clearAndGoBack() }
    ]);
  }

  const displaySucces = () => {
    Alert.alert("Felicitation !", "Votre compte a été bien crée , essayer de se connecter", [
      {
        text: "Ok",
        onPress: () => { null },
        // style: "cancel"
      },
      // { text: "Annuler", onPress:() => clearAndGoBack() }
    ]);
  }

  const displayduplication = () => {
    Alert.alert("Avertissement !", "Votre compte est déjà existé , ressayer avec des informations differentes", [
      {
        text: "Ok",
        onPress: () => { null },
        // style: "cancel"
      },
      // { text: "Annuler", onPress:() => clearAndGoBack() }
    ]);
  }

  const [loaderVisible, setLoaderVisible] = useState(false);

  const submitData = (data , reset) => {
    delete data.passwordConfirmation;
    // console.log(data);
    setLoaderVisible(true);
    post(globalConsts.links.SPRING_API, data, globalConsts.alias.REGISTER)
      .then((res) => {
        console.log(res.data);
        if(res.data == 'Ce medcin est déjà existé!'){
          setLoaderVisible(false);
          displayduplication();
        } else {
          setLoaderVisible(false);
          displaySucces();
          reset();
        }

      })
      .catch((error) => {
        console.log(error);
        setLoaderVisible(false);
        displayError();
      });
  };

  return (
    <TouchableWithoutFeedback
      style={[globalStyles.full]}
      onPress={Keyboard.dismiss}
    >
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        locations={[0, 0.3, 0.6]}
        colors={["#F1F5FC", "#C9DBFB", "#F5F4FD"]}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={globalStyles.full}
          contentContainerStyle={{
            paddingTop: 80,
            paddingBottom: 100,
          }}
        >
          <View style={globalStyles.full}>
            <View
              style={{
                alignSelf: "center",
                backgroundColor: "transparent",
                marginBottom: 25,
              }}
            >
              <Logo name="signup" />
              <View style={{ alignSelf: "center", marginTop: 20 }}>
                <GradientText text="S'inscrire" />
              </View>
            </View>
            <Formik
              validationSchema={signUpSchema}
              initialValues={{
                email: "",
                prenom: "",
                nom: "",
                password: "",
                passwordConfirmation: "",
                numero_pattente: "",
                inpe: "",
                num_tel: "",
              }}
              onSubmit={(values, actions) => {  submitData(values , actions.resetForm)  }}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
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
                      { alignItems: "center", justifyContent: "center" },
                    ]}
                  >
                    <InputCard
                      name="email"
                      value={values.email}
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      placeholder="example@gmail.com"
                      label="Email"
                    />
                    {printError(touched.email, errors.email)}
                  </View>
                  <View
                    style={[
                      globalStyles.fullWidth,
                      { alignItems: "center", justifyContent: "center" },
                    ]}
                  >
                    <InputCard
                      name="nom"
                      value={values.nom}
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      placeholder="nom"
                      label="Nom"
                    />
                    {printError(touched.nom, errors.nom)}
                  </View>
                  <View
                    style={[
                      globalStyles.fullWidth,
                      { alignItems: "center", justifyContent: "center" },
                    ]}
                  >
                    <InputCard
                      name="prenom"
                      value={values.prenom}
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      placeholder="prenom"
                      label="Prenom"
                    />
                    {printError(touched.prenom, errors.prenom)}
                  </View>
                  <View
                    style={[
                      globalStyles.fullWidth,
                      { alignItems: "center", justifyContent: "center" },
                    ]}
                  >
                    <InputCard
                      name="password"
                      value={values.password}
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      placeholder="*********"
                      label="Mot de passe"
                      password={true}
                    />
                    {printError(touched.password, errors.password)}
                  </View>
                  <View
                    style={[
                      globalStyles.fullWidth,
                      { alignItems: "center", justifyContent: "center" },
                    ]}
                  >
                    <InputCard
                      name="passwordConfirmation"
                      value={values.passwordConfirmation}
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      placeholder="*********"
                      label="Confirmer le mot de passe"
                      password={true}
                    />
                    {printError(
                      touched.passwordConfirmation,
                      errors.passwordConfirmation
                    )}
                  </View>
                  <View
                    style={[
                      globalStyles.fullWidth,
                      { alignItems: "center", justifyContent: "center" },
                    ]}
                  >
                    <InputCard
                      name="inpe"
                      value={values.inpe}
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      placeholder="141062281"
                      label="INPE"
                      type="numeric"
                    />
                    {printError(touched.inpe, errors.inpe)}
                  </View>
                  <View
                    style={[
                      globalStyles.fullWidth,
                      { alignItems: "center", justifyContent: "center" },
                    ]}
                  >
                    <InputCard
                      name="numero_pattente"
                      value={values.numero_pattente}
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      placeholder="163353"
                      label="Numero de patente"
                      type="numeric"
                    />
                    {printError(touched.patente, errors.patente)}
                  </View>
                  <View
                    style={[
                      globalStyles.fullWidth,
                      { alignItems: "center", justifyContent: "center" },
                    ]}
                  >
                    <InputCard
                      name="num_tel"
                      value={values.num_tel}
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      placeholder="0690347619"
                      label="Telephone"
                      type="numeric"
                    />
                    {printError(touched.phone, errors.phone)}
                  </View>
                  <View style={[{ marginTop: 30 }, globalStyles.fullWidth]}>
                    <AppButton
                      title="Créer"
                      bgColor={globalConsts.colors.primaryColor}
                      bdrColor={globalConsts.colors.primaryColor}
                      fontColor="#fff"
                      onPress={handleSubmit}
                    />
                  </View>
                </View>
              )}
            </Formik>
            <View
              style={[
                globalStyles.fullWidth,
                { paddingStart: 30, paddingTop: 20 },
              ]}
            >
              <Text
                style={{
                  color: globalConsts.colors.greyText,
                  fontWeight: "bold",
                }}
              >
                vous avez déjà un compte ?
              </Text>
              <Pressable onPress={() => navigation.navigate("Login")}>
                <Text
                  style={{
                    color: "#124673",
                    fontWeight: "bold",
                    fontSize: 18,
                    marginTop: 8,
                  }}
                >
                  Se connecter
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
        <LoaderModal visible={loaderVisible} />
      </LinearGradient>
    </TouchableWithoutFeedback>
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
