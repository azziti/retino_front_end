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
import ImageView from "react-native-image-viewing";
import { useStateIfMounted } from "use-state-if-mounted";
import { getItem } from "../Services/store-service";
import { authGet } from "../Services/http-service";
import { useFocusEffect } from "@react-navigation/native";

export default function ControleDetails({ route, navigation }) {
  const [right, setRight] = useStateIfMounted([]);
  const [left, setLeft] = useStateIfMounted([]);
  const [rightIndex, setRightIndex] = useState(0);
  const [leftIndex, setLeftIndex] = useState(0);
  const [rightVisible, setRightVisible] = useState(false);
  const [leftVisible, setLeftVisible] = useState(false);
  const [medcinId, setMedcinId] = useStateIfMounted(null);
  const [token, setToken] = useStateIfMounted(null);
  const [loaderVisible, setLoaderVisible] = useState(false);
  const [data, setData] = useStateIfMounted([]);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // Alert.alert("Avertisement !", "Est vous etes sure que vous voulez annuler le controle", [
        //   {
        //     text: "Rester",
        //     onPress: () => { null },
        //     // style: "cancel"
        //   },
        //   { text: "Quitter", onPress:() => clearAndGoBack() }
        // ]);
        if(route.params.flag != null && route.params.flag){
          navigation.goBack();
        } else {
          navigation.popToTop();
          navigation.replace("EntryPage");
        }
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    } ,[])
  );

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

  const stades = {
    "PAS_DE_RD" :'ABS' , 
    "RDNP_MINIME" :'1' , 
    "RDNP_MODEREE" :'2' ,
    "RDNP_SEVERE" : '3', 
    "RD_TRAITEE_NON_ACTIVE" : '4' ,
  };

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
        route.params.idControl +
        "/details"
      // "/patients/17/controls/24"
    )
      .then(async (res) => {
        console.log(res.data);
        setData(res.data);
        setRight(
          res.data.right_aquisitions.map((image) => {
            return {
              uri: globalConsts.links.SPRING_API+image.url,
            };
          })
        );

        setLeft(
          res.data.left_aquisition.map((image) => {
            return {
              uri: globalConsts.links.SPRING_API+image.url,
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

  const openRightModal = (index) => {
    setRightIndex(index);
    setLeftVisible(true);
  };

  const openLeftModal = (index) => {
    setLeftIndex(index);
    setLeftVisible(true);
  };

  // useEffect(() => {
  //   setRight(route.params.images.right);
  //   setLeft(route.params.images.left);
  // }, []);

  return (
    <View style={[globalStyles.safeArea, globalStyles.full, styles.container]}>
      <Header
        title="Controle"
        onBackPress={() => {
          if(route.params.flag != null && route.params.flag){
            navigation.goBack();
          } else {
            navigation.popToTop();
            navigation.replace("EntryPage");
          }

          // navigation.reset({
          //   index: 0,
          //   actions: [navigation.navigate({ routeName: 'EntryPage' })],
          // })
        }}
      />
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
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginBottom: 10,
                      }}
                    >
                      <View>
                        <Text style={[styles.headerText]}>{(data.patient.prenom =! null ? data.patient.prenom : 'inkonnu') + ' ' +( data.patient.nom =! null ? data.patient.nom : 'inkonnu')}</Text>
                        <Text style={[styles.text , {textAlign : 'left'}]}>{data.patient.date_naissance =! null ? data.patient.date_naissance : 'non precis'}</Text>
                      </View>
                      <View>
                        <Text style={[styles.headerText]}>
                          {" "}
                          médecin traitant
                        </Text>
                        <Text style={[styles.text]}>{(data.medcin.prenom =! null ? data.medcin.prenom : 'inkonnu') + ' ' +( data.medcin.nom =! null ? data.medcin.nom : 'inkonnu')}</Text>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginBottom: 10,
                      }}
                    >
                      <View>
                        <Text style={[styles.headerText]}>Date :</Text>
                        <Text style={[styles.text]}>{data.created_at == null ?  'non precis' : data.created_at }</Text>
                      </View>
                      <View>
                        <Text style={[styles.headerText]}>
                          {" "}
                          aquisiteur
                        </Text>
                        <Text style={[styles.text]}>{data.medcin_2 == null ? 'non defini' : data.medcin_2}</Text>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginBottom: 10,
                      }}
                    >
                      <View>
                        <Text style={[styles.headerText]}>CIN</Text>
                        <Text style={[styles.text]}>{(data.patient.cin =! null ? data.patient.cin : 'non defini')}</Text>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginBottom: 10,
                      }}
                    >
                      <View>
                        <Text style={[styles.headerText]}>Bilan</Text>
                        <Text style={[styles.text]}>
                          {" "}
                          {data.bilan == null ? 'non defini' : data.bilan }
                          {" "}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.infoCard,
                      { flexDirection: "row", justifyContent: "space-around" },
                    ]}
                  >
                    <View
                      style={{ alignItems: "center", justifyContent: "center" }}
                    >
                      <Text style={[styles.headerText]}>OD</Text>
                      <Text style={[styles.text]}>{data.patient_stade_obj.sod == null ? 'non defini' : stades[data.patient_stade_obj.sod] }</Text>
                    </View>
                    <View
                      style={{ alignItems: "center", justifyContent: "center" }}
                    >
                      <Text style={[styles.headerText]}>OG</Text>
                      <Text style={[styles.text]}>{data.patient_stade_obj.sog == null ? 'non defini' : stades[data.patient_stade_obj.sog] }</Text>
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
                                  uri:item.uri,
                                }}
                              />
                            </View>
                          </Pressable>
                        ))}
                      </View>
                    </View>
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
        </ScrollView>
      </View>

      <View>
        {(() => {
          if (data && data.patient && data.medcin) {
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
    textAlign : 'right'
  },
});
