import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
  Image,
  Pressable,
  TouchableOpacity,
  BackHandler,
} from "react-native";
import React, { useState, useEffect } from "react";
import { globalStyles } from "../Globals/global-styles";
import { globalConsts } from "../Globals/global-const";
import Header from "../Components/header";
import AppButton from "../Components/app-button";
import ImageView from "react-native-image-viewing";
import IndexationButton from "../Components/indexation-button";
import { number } from "yup";
import { useStateIfMounted } from "use-state-if-mounted";
import { getItem } from "../Services/store-service";
import { authGet, authPost, fileAuthPost } from "../Services/http-service";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import LoaderModal from "../Components/loader";

export default function IndexationDetails({ route, navigation }) {
  const [visible, setIsVisible] = useState(false);
  const [selected, setSelected] = useState("NOT DEFINED");
  const [imageIndex, setImageIndex] = useState(0);
  const [selectedImages, setSelectedImages] = useStateIfMounted([]);
  const [medcinId, setMedcinId] = useStateIfMounted(null);
  const [token, setToken] = useStateIfMounted(null);
  const [indexation, setIndexation] = useStateIfMounted(null);
  const [loaderVisible, setLoaderVisible] = useState(false);


  const stades = {
    // 'ABS' : 'NOT DEFINED' ,
    'ABS': "PAS_DE_RD",
    '1': "RDNP_MINIME",
    '2': "RDNP_MODEREE",
    '3': "RDNP_SEVERE",
    '4': "RD_TRAITEE_NON_ACTIVE",
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // Alert.alert("Avertisement !", "Est vous etes sure que vous voulez annuler le controle", [
        //   {
        //     text: "Rester",
        //     onPress: () => { null },
        //     // style: "cancel"
        //   },
        //   { text: "Annuler", onPress:() => clearAndGoBack() }
        // ]);
        navigation.replace('IndexationList');
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
    if (medcinId != null && token != null) {
      fetchData();
    }
  }, [medcinId, token]);

  const fetchData = async () => {
    // setLoaderVisible(true)
    // console.log("medcins/" + medcinId + "/patients/" + route.params.id);

    authGet(
      token,
      globalConsts.links.SPRING_API,
      {},
      // "medcins/" + medcinId + "/patients/" + route.params.id
      "Echantillon/NotIndexedEchantillons/" + route.params.id
    )
      .then(async (res) => {
        console.log(res.data);
        setIndexation(res.data);
        setSelectedImages(
          res.data.imageDtos.map((image) => {
            return {
              uri:
                globalConsts.links.SPRING_API +
                "Echantillon/image/" +
                image.url,
            };
          })
        );
        console.log('selected images ' , selectedImages);
      })
      .catch(async (err) => {
        console.log(err);
        // setLoaderVisible(false)
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

  const submit = () => {
    let tempData = new FormData()
    tempData.append('stade' , selected)
    console.log("Echantillon/NotIndexedEchantillon/" + route.params.id)
    setLoaderVisible(true);
    fileAuthPost(token , globalConsts.links.SPRING_API , tempData , "Echantillon/NotIndexedEchantillon/" + route.params.id )
    .then((res) => {
      console.log(res.data)
      setLoaderVisible(false);
      navigation.replace("IndexationList");
    })
    .catch((error) => { console.log(error) ; setLoaderVisible(false); displayError()
    });
    
  };

  const handleSelect = (value) => {
    setSelected(value);
    const data = selectedImages.map((item) => {
      item.stade = value;
      return item;
    });
    setSelectedImages([...data]);
    // console.log(selectedImages);
    // console.log(selectedImages.length);
    console.log(selected);
  };

  const openModal = (index) => {
    console.log(index);
    setImageIndex(index);
    setIsVisible(true);
  };

  return (
    <View style={[globalStyles.safeArea, globalStyles.full, styles.container]}>
      <Header title="Indexation" />
      <View style={styles.body}>
        <LoaderModal visible={loaderVisible} />
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingVertical: 20 }}
        >
          {(() => {
            if (indexation != null) {
              return (
                <>
                  <View
                    style={[
                      styles.infoCard,
                      { flexDirection: "row", justifyContent: "space-around" },
                    ]}
                  >
                    <View
                      style={{ alignItems: "center", justifyContent: "center" }}
                    >
                      <Text style={[styles.headerText]}>Date</Text>
                      <Text style={[styles.text]}>{ indexation.date_acquisition != null ? indexation.date_acquisition : 'non definit'}</Text>
                    </View>
                    <View
                      style={{ alignItems: "center", justifyContent: "center" }}
                    >
                      <Text style={[styles.headerText]}>Œil</Text>
                      <Text style={[styles.text]}>{indexation.eye == 'RIGHT' ? 'OD' : 'OG'}</Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.buttonContainer,
                      { flexDirection: "row", justifyContent: "space-around" },
                    ]}
                  >
                    <IndexationButton
                      title="ABS"
                      value={stades["ABS"]}
                      selected={selected}
                      onPress={() => handleSelect(stades["ABS"])}
                    />
                    <IndexationButton
                      title="1"
                      value={stades["1"]}
                      selected={selected}
                      onPress={() => handleSelect(stades["1"])}
                    />
                    <IndexationButton
                      title="2"
                      value={stades["2"]}
                      selected={selected}
                      onPress={() => handleSelect(stades["2"])}
                    />
                    <IndexationButton
                      title="3"
                      value={stades["3"]}
                      selected={selected}
                      onPress={() => handleSelect(stades["3"])}
                    />
                    <IndexationButton
                      title="4"
                      value={stades["4"]}
                      selected={selected}
                      onPress={() => handleSelect(stades["4"])}
                    />
                    {/* <IndexationButton
                      title="5"
                      value={stades['5']}
                      selected={selected}
                      onPress={() => handleSelect(stades['5'])}
                    /> */}
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
                        {selectedImages.map((image, index) => (
                          <View
                            key={index}
                            style={{ width: "25%", aspectRatio: 1, padding: 5 }}
                          >
                            <TouchableOpacity
                              style={{ flex: 1 }}
                              onPress={() => openModal(index)}
                            >
                              <Image
                                style={{ flex: 1, borderRadius: 10 }}
                                resizeMode="cover"
                                source={{
                                  uri: image.uri,
                                }}
                              />
                            </TouchableOpacity>
                          </View>
                        ))}
                      </View>
                    </View>
                  </View>
                  <AppButton
                    title="Sauvegarder"
                    bgColor={globalConsts.colors.primaryColor}
                    bdrColor={globalConsts.colors.primaryColor}
                    fontColor="#fff"
                    onPress={submit}
                  />
                </>
              );
            } else {
              return (
                <View style={{ width: "100%" }}>
                  <Text style={{ alignSelf: "center" }}>Pas d'indexation</Text>
                </View>
              );
            }
          })()}
        </ScrollView>
      </View>

      <View>
        {(() => {
          if (indexation != null) {
            return (
              <ImageView
                images={selectedImages}
                imageIndex={imageIndex}
                visible={visible}
                onRequestClose={() => setIsVisible(false)}
              />
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
  },
  buttonContainer: {
    marginVertical: 10,
    backgroundColor: globalConsts.colors.secondaryColor,
    borderRadius: 20,
    marginHorizontal: 15,
    borderColor: globalConsts.colors.greyText,
    borderWidth: 0.4,
    overflow: "hidden",
  },
  button: {
    borderColor: globalConsts.colors.greyText,
    borderRightWidth: 0.4,
    borderLeftWidth: 0.4,
    flex: 1,
    minHeight: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
