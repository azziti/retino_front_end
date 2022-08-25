import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
  Image,
  Pressable,
  BackHandler,
} from "react-native";
import React, { useState, useEffect } from "react";
import { globalStyles } from "../Globals/global-styles";
import { globalConsts } from "../Globals/global-const";
import Header from "../Components/header";
import AppButton from "../Components/app-button";
import { Formik } from "formik";
import * as yup from "yup";
import InputCard from "../Components/input-card";
import { RadioButton } from "react-native-paper";
import { useStateIfMounted } from "use-state-if-mounted";
import ImageView from "react-native-image-viewing";
import { useFocusEffect } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { setImages } from "../Reducers/images-reducer";
import { getItem } from "../Services/store-service";
import { authGet, authPost } from "../Services/http-service";
import LoaderModal from "../Components/loader";

export default function GenerateReport({ route, navigation }) {
  const dispatch = useDispatch();

  const [right, setRight] = useStateIfMounted([]);
  const [left, setLeft] = useStateIfMounted([]);
  const [rightIndex, setRightIndex] = useState(0);
  const [leftIndex, setLeftIndex] = useState(0);
  const [rightVisible, setRightVisible] = useState(false);
  const [leftVisible, setLeftVisible] = useState(false);
  const [predictionOG, setPredictionOG] = useStateIfMounted([]);
  const [predictionOD, setPredictionOD] = useStateIfMounted([]);
  const [medcinId, setMedcinId] = useStateIfMounted(null);
  const [token, setToken] = useStateIfMounted(null);
  const [loaderVisible, setLoaderVisible] = useState(false);
  const [data, setData] = useStateIfMounted([]);

  useEffect(() => {
    (async () => {
      setMedcinId(await getItem(globalConsts.alias.USER));
      setToken(await getItem(globalConsts.alias.TOKEN));
    })();
  }, []);

  useEffect(() => {
    if (medcinId && token) {
      fetchData();
    }
  }, [medcinId, token]);

  const fetchData = async () => {
    // setLoaderVisible(true)
    console.log("medcins/" + medcinId + "/patients/" + route.params.id);

    authGet(
      token,
      globalConsts.links.SPRING_API,
      {},
      "patients/" +
        route.params.idPatient +
        "/controls/" +
        route.params.idControl
      // "/patients/17/controls/24"
    )
      .then(async (res) => {
        console.log(res.data);
        setData(res.data);
        setRight(
          res.data.right_aquisitions.map((image) => {
            return {
              uri: globalConsts.links.SPRING_API + image.url,
            };
          })
        );
        setLeft(
          res.data.left_aquisition.map((image) => {
            return {
              uri: globalConsts.links.SPRING_API + image.url,
            };
          })
        );
      })
      .catch(async (err) => {
        console.log(err);
        // setLoaderVisible(false)
        // saveItem(globalConsts.alias.LOGIN, true);
        // dispatch(setLogin(await getItem(globalConsts.alias.LOGIN)))
      });
  };

  const uplaadV2 = () => {
    let data = new FormData();

    data.append("sod", stadeEnum[0]);
    data.append("sog", stadeEnum[1]);

    selectedRightEyeImages.forEach((file, index) => {
      data.append("images", {
        name: file.eye + "image_" + index + "_" + file.eye + ".jpg",
        type: "image/jpg",
        uri: Platform.OS === "ios" ? file.uri.replace("file://", "") : file.uri,
      });
    });

    selectedLeftEyeImages.forEach((file, index) => {
      data.append("images", {
        name: file.eye + "image_" + index + "_" + file.eye + ".jpg",
        type: "image/jpg",
        uri: Platform.OS === "ios" ? file.uri.replace("file://", "") : file.uri,
      });
    });
    setLoaderVisible(true);
    fileAuthPost(
      token,
      globalConsts.links.SPRING_API,
      data,
      "medcins/" + medcinId + "/patients/" + route.params.id + "/addControl"
    )
      .then((res) => {
        console.log(res.data);
        setLoaderVisible(false);
        navigation.navigate("GenerateRapport", {
          // right: selectedRightEyeImages,
          // left: selectedLeftEyeImages,
          // predictionOD : res.data.OD ,
          // predictionOG : res.data.OG ,
          id: res.data,
        });
      })
      .catch((error) => {
        console.log(error);
        setLoaderVisible(false);
      });
  };

  const stades = {
    "PAS_DE_RD" :'ABS' , 
    "RDNP_MINIME" :'1' , 
    "RDNP_MODEREE" :'2' ,
    "RDNP_SEVERE" : '3', 
    "RD_TRAITEE_NON_ACTIVE" : '4' ,
  };

  const upload = (data) => {
    const temp = {
      medcin_2 : data.doctor ,
      bilan : data.bilan ,
      id : route.params.idControl
    }
    setLoaderVisible(true)
    authPost(
      token,
      globalConsts.links.SPRING_API,
      temp,
      "patients/" +
        route.params.idPatient +
        "/controls/" +
        route.params.idControl +
        "/update"
    )
      .then((res) => {
        console.log(res.data);
        // goToCameraScreen(res.data.id, res.data.nom, res.data.prenom);
        setLoaderVisible(false)
        navigation.replace("ControleDetails", {
          idPatient : route.params.idPatient ,
          idControl : route.params.idControl
        });
      })
      .catch((error) => {
        // if (error.response.status == 417) {
        //   console.log("patient already existe");
        // } else if (error.response.status == 400) {
        //   console.log("bad request");
        // } else if (error.response.status == 405) {
        //   console.log("methode not allowed");
        // } else if (error.response.status == 403) {
        //   console.log("acces interdit");
        // } else {
        //   console.log("erreur interne de serveur");
        // }
        console.log(error)
        setLoaderVisible(false)
      });
  };

  // To customize the back behavior
  const clearAndGoBack = () => {
    dispatch(setImages([]));
    navigation.replace("EntryPage");
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          "Avertisement !",
          "Avant de Quitter vous devez remplir ces informations",
          [
            {
              text: "Rester",
              onPress: () => {
                null;
              },
              // style: "cancel"
            },
            { text: "Quitter", onPress: () => clearAndGoBack() },
          ]
        );
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );

  const openRightModal = (index) => {
    setRightIndex(index);
    setLeftVisible(true);
  };

  const openLeftModal = (index) => {
    setLeftIndex(index);
    setLeftVisible(true);
  };

  const formSchema = yup.object({
    doctor: yup
      .string("le champs du medcin doit etre une chaine de caracteres")
      .required("le champs du medcine est obligatoire"),
    bilan: yup
      .string("le nom doit etre une chaine de caracteres")
      .required("le nom est obligatoire"),
  });

  // useEffect(() => {
  //   setRight(route.params.right);
  //   setLeft(route.params.left);
  //   setPredictionOG(route.params.predictionOG);
  //   setPredictionOD(route.params.predictionOD);
  // }, []);

  return (
    <View style={[globalStyles.safeArea, globalStyles.full, styles.container]}>
      <Header title="Controle" />
      <View style={styles.body}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingVertical: 20 }}
        >
          {(() => {
            if (data && data.patient && data.medcin) {
              return (
                <>
                  <View style={[styles.infoCard]}>
                    <View
                      style={{ alignItems: "center", justifyContent: "center" }}
                    >
                      <Text style={[styles.headerText]}>
                        {(data.patient.prenom = !null
                          ? data.patient.prenom
                          : "inkonnu") +
                          " " +
                          (data.patient.nom = !null
                            ? data.patient.nom
                            : "inkonnu")}
                      </Text>
                      <Text style={[styles.text]}>
                        {
                          (data.patient.date_naissance = !null
                            ? data.patient.date_naissance
                            : "non precis")
                        }
                      </Text>
                    </View>
                    <View>
                      <Text style={[styles.headerText]}> médecin traitant</Text>
                      <Text style={[styles.text]}>
                        {(data.medcin.prenom == null
                          ? "inkonnu"
                          : data.medcin.prenom) +
                          " " +
                          (data.medcin.nom == null
                            ? "inkonnu"
                            : data.medcin.nom)}
                      </Text>
                      {/* <Text style={[styles.text]}>{data.patient.prenom && data.patient.prenom}</Text> */}
                    </View>
                  </View>

                  <View style={[styles.samplesContainer]}>
                    <View style={[{ flex: 1 }]}>
                      <View style={[styles.listHeader]}>
                        <Text style={{ fontWeight: "bold" }}>
                          OG (Oeil gauche)
                        </Text>
                      </View>
                      <View
                        style={[styles.samplesList, { paddingVertical: 5 }]}
                      >
                        {left.map((item, index) => (
                          <Pressable
                            onPress={() => {
                              openLeftModal(index);
                            }}
                            key={index}
                            style={{ width: "25%", aspectRatio: 1, padding: 5 }}
                          >
                            <View style={{ flex: 1 }}>
                              <Image
                                style={{ flex: 1, borderRadius: 10 }}
                                resizeMode="cover"
                                source={{
                                  uri: item.uri,
                                }}
                              />
                            </View>
                          </Pressable>
                        ))}
                      </View>
                    </View>
                  </View>

                  <View style={[styles.samplesContainer]}>
                    <View style={[{ flex: 1 }]}>
                      <View style={[styles.listHeader]}>
                        <Text style={{ fontWeight: "bold" }}>
                          OD (Oeil droite)
                        </Text>
                      </View>
                      <View
                        style={[styles.samplesList, { paddingVertical: 5 }]}
                      >
                        {right.map((item, index) => (
                          <Pressable
                            onPress={() => {
                              openRightModal(index);
                            }}
                            key={index}
                            style={{ width: "25%", aspectRatio: 1, padding: 5 }}
                          >
                            <View style={{ flex: 1 }}>
                              <Image
                                style={{ flex: 1, borderRadius: 10 }}
                                resizeMode="cover"
                                source={{
                                  uri: item.uri,
                                }}
                              />
                            </View>
                          </Pressable>
                        ))}
                      </View>
                    </View>
                  </View>

                  <View style={[styles.infoCard]}>
                    <View
                      style={{ alignItems: "center", justifyContent: "center" }}
                    >
                      <Text style={[styles.headerText]}>OD</Text>
                      <Text style={[styles.text]}>
                        {stades[data.patient_stade_obj.sod]}
                      </Text>
                    </View>
                    <View
                      style={{ alignItems: "center", justifyContent: "center" }}
                    >
                      <Text style={[styles.headerText]}>OG</Text>
                      <Text style={[styles.text]}>
                        {stades[data.patient_stade_obj.sod]}
                      </Text>
                    </View>
                  </View>

                  <View styles={[styles.form]}>
                    <Formik
                      validationSchema={formSchema}
                      initialValues={{
                        doctor: "",
                        bilan: "",
                      }}
                      onSubmit={(values, actions) => {
                        // values.images = {
                        //   right: [...right],
                        //   left: [...left],
                        // };
                        // values.images.right = right
                        // values.images.left = left
                        upload(values)

                      }}
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
                              {
                                alignItems: "center",
                                justifyContent: "center",
                              },
                            ]}
                          >
                            <InputCard
                              name="doctor"
                              value={values.lastName}
                              handleBlur={handleBlur}
                              handleChange={handleChange}
                              placeholder="omar navaro"
                              label="Aquisiteur"
                            />
                            {printError(touched.doctor, errors.doctor)}
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
                              lines={7}
                              name="bilan"
                              value={values.firstName}
                              handleBlur={handleBlur}
                              handleChange={handleChange}
                              placeholder="example@gmail.com"
                              label="Bilan"
                            />
                            {printError(touched.bilan, errors.bilan)}
                          </View>
                          <View
                            style={[{ marginTop: 30 }, globalStyles.fullWidth]}
                          >
                            <AppButton
                              title="Generer le rapport"
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
                </>
              );
            } else {
              return (
                <View style={{ width: "100%" }}>
                  <Text style={{ alignSelf: "center" }}>
                    en cours de chargement
                  </Text>
                </View>
              );
            }
          })()}
          <LoaderModal visible={loaderVisible} />
        </ScrollView>
      </View>

      {(() => {
        if (data != null) {
          console.log(right);
          return (
            <>
              <ImageView
                isSwipeCloseEnabled={true}
                isPinchZoomEnabled={true}
                isTapZoomEnabled={true}
                images={left}
                imageIndex={leftIndex}
                visible={leftVisible}
                onRequestClose={() => setLeftVisible(false)}
              />

              <ImageView
                isSwipeCloseEnabled={true}
                isPinchZoomEnabled={true}
                isTapZoomEnabled={true}
                images={right}
                imageIndex={rightIndex}
                visible={rightVisible}
                onRequestClose={() => setRightVisible(false)}
              />
            </>
          );
        }
      })()}
    </View>
  );
}

const styles = StyleSheet.create({
  listHeader: {
    alignItems: "center",
    backgroundColor: globalConsts.colors.helperColor,
    borderRadius: 10,
    padding: 8,
    margin: 5,
  },

  container: {
    backgroundColor: globalConsts.colors.primaryColor,
  },
  infoCard: {
    marginVertical: 10,
    backgroundColor: globalConsts.colors.secondaryColor,
    borderRadius: 20,
    marginHorizontal: 15,
    padding: 12,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-around",
    borderColor: globalConsts.colors.greyText,
    borderWidth: 0.4,
  },
  body: {
    paddingVertical: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: globalConsts.colors.helperColor,
    // backgroundColor : 'black' ,
    flex: 1,
  },
  samplesContainer: {
    backgroundColor: globalConsts.colors.secondaryColor,
    margin: 15,
    borderRadius: 10,
    flex: 1,
    flexDirection: "row",
  },
  samplesList: {
    flex: 1,
    flexWrap: "wrap",
    flexDirection: "row",
  },
  headerText: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 5,
  },
  text: {
    fontSize: 12,
    color: globalConsts.colors.greyText,
    fontWeight: "bold",
  },
  form: {
    backgroundColor: globalConsts.colors.secondaryColor,
    margin: 15,
    borderRadius: 10,
    flex: 1,
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
