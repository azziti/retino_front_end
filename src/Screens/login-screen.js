import { View, Text, Pressable, Alert } from "react-native";
import React, { useState } from "react";
import { globalStyles } from "../Globals/global-styles";
import Logo from "../Components/logo";
import InputCard from "../Components/input-card";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import Checkbox from "expo-checkbox";
import AppButton from "../Components/app-button";
import { globalConsts } from "../Globals/global-const";
import { Formik } from "formik";
import { LinearGradient } from "expo-linear-gradient";
import * as yup from "yup";
import GradientText from "../Components/gradient-text";
import { useDispatch, useSelector } from "react-redux";
import { setLogin } from "../Reducers/authentication-reducer";
import { setToken } from "../Reducers/token-reducer";
import { setUser } from "../Reducers/user-details-reducer";
import { getItem, saveItem } from "../Services/store-service";
import { post } from "../Services/http-service";
import LoaderModal from "../Components/loader";

export default function LoginScreen({ navigation }) {
  // const [isChecked, setChecked] = useState(false);

  const dispatch = useDispatch();
  const reduxLogin = useSelector((state) => {
    return state.login.logged;
  });

  const [loaderVisible , setLoaderVisible ] = useState(false);

  const logInSchema = yup.object({
    email: yup
      .string()
      .email("Svp donner un email valide")
      .required("l'email est obligatoire"),
    password: yup
      .string()
      .required("le mot de passe est obligatoire")
      .min(8, "le mot de passe doit avoir au moins 8 caracteres"),
  });

  const submitData = async (data) => {
    setLoaderVisible(true)
    post( globalConsts.links.SPRING_API , { email : data.email , password : data.password} , globalConsts.alias.LOGIN).then(async (res) =>{
      setLoaderVisible(false)
      const token = res.headers.authorization
      const user_id = res.headers.user_id
      console.log(res.data)
      saveItem(globalConsts.alias.USER, user_id );
      dispatch(setUser(await getItem(globalConsts.alias.USER)));
      saveItem(globalConsts.alias.TOKEN, token)
      dispatch(setLogin(await getItem(globalConsts.alias.TOKEN)));
      saveItem(globalConsts.alias.LOGIN, true);
      dispatch(setLogin(await getItem(globalConsts.alias.LOGIN)));

    }).catch( async (err) => {
      console.log(err)
      setLoaderVisible(false)
      displayError();
      // saveItem(globalConsts.alias.LOGIN, true);
      // dispatch(setLogin(await getItem(globalConsts.alias.LOGIN)))

  });

  };

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

  return (
    <TouchableWithoutFeedback
      style={[globalStyles.container, { backgroundColor: "#000" }]}
      onPress={Keyboard.dismiss}
    >
      <View style={{ flex: 1 }}>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          locations={[0, 0.3, 0.6]}
          colors={["#F1F5FC", "#C9DBFB", "#F5F4FD"]}
          style={{ flex: 1 }}
        >
          <View style={globalStyles.container}>
            <Logo name="logo" />
            <View style={{ alignSelf: "center", marginTop: 20 }}>
              <GradientText text="Se connecter" />
            </View>
            <Formik
              validationSchema={logInSchema}
              initialValues={{
                email: "",
                password: "",
                rememberMe: false,
              }}
              onSubmit={(values, actions) => submitData(values) }
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
                  <InputCard
                    name="email"
                    value={values.email}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    placeholder="example@gmail.com"
                    label="Email"
                  />
                  {printError(touched.email, errors.email)}
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
                  <View style={[{ marginTop: 20 }, globalStyles.fullWidth]}>
                    <View style={globalStyles.checkBox}>
                      <Checkbox
                        value={values.rememberMe}
                        onValueChange={(nextValue) =>
                          setFieldValue("rememberMe", nextValue)
                        }
                        color={
                          values.rememberMe
                            ? globalConsts.colors.primaryColor
                            : undefined
                        }
                      />
                      <Text style={{ marginStart: 5, fontWeight: "bold" }}>
                        Se rappeler de moi ?
                      </Text>
                    </View>

                    <AppButton
                      title="Se Connecter"
                      bgColor={globalConsts.colors.primaryColor}
                      bdrColor={globalConsts.colors.primaryColor}
                      fontColor="#fff"
                      onPress={handleSubmit}
                    />
                  </View>
                </View>
              )}
            </Formik>
            <View style={[globalStyles.fullWidth, { paddingStart: 30 }]}>
              <Text
                style={{
                  color: globalConsts.colors.greyText,
                  fontWeight: "bold",
                }}
              >
                Vous n'avez pas un compte ?
              </Text>
              <Pressable onPress={() => navigation.navigate("Register")}>
                <Text
                  style={{
                    color: "#124673",
                    fontWeight: "bold",
                    fontSize: 18,
                    marginTop: 8,
                  }}
                >
                  S'inscrire
                </Text>
              </Pressable>
            </View>
          </View>
        </LinearGradient>
        <LoaderModal visible={loaderVisible} />
      </View>
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
