import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Alert,
  BackHandler,
} from "react-native";
import React from "react";
import { Camera } from "expo-camera";
import { useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  HStack,
  VStack,
  Image,
  Center,
  NativeBaseProvider,
  ScrollView,
} from "native-base";

import * as Icon from "react-native-feather";
import { useStateIfMounted } from "use-state-if-mounted";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import IndexationButton from "../Components/indexation-button";
import { globalConsts } from "../Globals/global-const";
import Ionicons from "react-native-vector-icons/Ionicons";
import { fileAuthPost } from "../Services/http-service";
import { getItem, saveItem } from "../Services/store-service";
import LoaderModal from "../Components/loader";
import * as Permissions from "expo-permissions";
import NetInfo from "@react-native-community/netinfo";
import * as MediaLibrary from "expo-media-library";

export default function IndexationCamera({ navigation }) {
  const askPermission = async () => {
    const mediaPermission = await MediaLibrary.requestPermissionsAsync();
    if (mediaPermission.status == "granted") {
      console.log("permission granted");
    }
  };

  const LIMIT = 5;
  // if the compoenet if focused or not
  const isFocused = useIsFocused();

  const stades = {
    ND: "NOT_INDEXED",
    ABS: "PAS_DE_RD",
    1: "RDNP_MINIME",
    2: "RDNP_MODEREE",
    3: "RDNP_SEVERE",
    4: "RD_TRAITEE_NON_ACTIVE",
  };

  const displayError = () => {
    Alert.alert("Avertissement !", "problème de connexion", [
      {
        text: "Ok",
        onPress: () => {
          null;
        },
        // style: "cancel"
      },
      // { text: "Annuler", onPress:() => clearAndGoBack() }
    ]);
  };

  const displayStoreError = () => {
    Alert.alert("Avertissement !", "problème de sauvegarde", [
      {
        text: "Ok",
        onPress: () => {
          null;
        },
        // style: "cancel"
      },
      // { text: "Annuler", onPress:() => clearAndGoBack() }
    ]);
  };

  const displaySuccess = () => {
    Alert.alert("Félicitation !", "l'opération s'est bien passé", [
      {
        text: "Ok",
        onPress: () => {
          navigation.replace("IndexationListLocal");
        },
        // style: "cancel"
      },
      // { text: "Annuler", onPress:() => clearAndGoBack() }
    ]);
  };


  //states
  //check camera permission
  const [hasCameraPermission, setHasCameraPermission] = useStateIfMounted(null);
  const [camera, setCamera] = useStateIfMounted(null);
  // the camera type
  const [type, setType] = useStateIfMounted(Camera.Constants.Type.back);
  // boolean to check if we should display the next button
  const [showNext, setShowNext] = useStateIfMounted(false);
  // all the captured images
  const [savedImages, setSavedImages] = useStateIfMounted([]);
  const [selected, setSelected] = useStateIfMounted(stades["ND"]);
  const [eye, setEye] = useStateIfMounted("OD");
  const [medcinId, setMedcinId] = useStateIfMounted(null);
  const [token, setToken] = useStateIfMounted(null);
  const [loaderVisible, setLoaderVisible] = useState(false);

  const handleSelect = (value) => {
    setSelected(value);
    const data = savedImages.map((item) => {
      item.stade = value;
      return item;
    });
    setSavedImages([...data]);
  };
  const selectEye = (value) => {
    setEye(value);
    const data = savedImages.map((item) => {
      item.eye = value;
      return item;
    });
    setSavedImages([...data]);
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        Alert.alert("Avertissement !", "Annuler l'opération ?", [
          {
            text: "Rester",
            onPress: () => {
              null;
            },
            // style: "cancel"
          },
          { text: "Quitter", onPress: () => clearAndGoBack() },
        ]);
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );

  const deleteImageAlert = (image) => {
    Alert.alert("Avertissement !", "Supprimer l'image ?", [
      {
        text: "Non",
        onPress: () => {
          null;
        },
        // style: "cancel"
      },
      { text: "Oui", onPress: () => deleteImage(image) },
    ]);
  };

  // delete image from the state
  const deleteImage = (image) => {
    const newImages = savedImages.filter((img) => img != image);
    setSavedImages(newImages);
    if (savedImages.length >= LIMIT) {
      setShowNext(true);
    } else {
      setShowNext(false);
    }
  };

  // check the camera permission on the app start
  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");
      setMedcinId(await getItem(globalConsts.alias.USER));
      setToken(await getItem(globalConsts.alias.TOKEN));
    })();
  }, []);

  useEffect(() => {
    (function () {
      console.log("state images", savedImages);
      console.log("images count ", savedImages.length);

      if (savedImages.length >= LIMIT) {
        setShowNext(true);
      } else {
        setShowNext(false);
      }
    })();
  }, [savedImages]);

  const takePicture = async () => {
    if (camera) {
      const option = { quality: 1, based64: true, skipProcessing: false };
      try {
        const data = await camera.takePictureAsync(option);
        const image = {
          uri: data.uri,
          eye: eye,
          stade: selected,
        };
        const newImages = [...savedImages, image];
        setSavedImages(newImages);

        if (savedImages.length >= LIMIT) {
          setShowNext(true);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const upload = () => {

    NetInfo.fetch()
      .then((state) => {
        console.log("Connection type", state.type);
        console.log("Is connected?", state.isConnected);
        if (state.isConnected) {
          setLoaderVisible(true);
          let data = new FormData();
          // data.append('data' ,  )

          savedImages.forEach((file, index) => {
            data.append("images", {
              name: "image_" + index + "_" + selected + "_" + file.eye + ".jpg",
              type: "image/jpg",
              uri:
                Platform.OS === "ios"
                  ? file.uri.replace("file://", "")
                  : file.uri,
            });
          });
          data.append("medcinID", medcinId);
          data.append("eye", eye == "OD" ? "RIGHT" : "LEFT");
          data.append("stade", selected);
          // console.log(data);

          fileAuthPost(
            token,
            globalConsts.links.SPRING_API,
            data,
            "Echantillon/Acquisition"
          )
            .then((res) => {
              console.log(res.data);
              setLoaderVisible(false);
              navigation.replace("IndexationEntryScreen");
            })
            .catch((error) => {
              console.log(error);
              setLoaderVisible(false);
              displayError();
            });
          // get(null ,"test").then(data=>console.log(data.data)).catch(error => console.log(error) )
          // console.log(data);
        } else {
          Alert.alert(
            "Avertissement !",
            "vous êtes hors ligne , voulez vous continuer ?",
            [
              {
                text: "OUI",
                onPress: async () => {
                  setLoaderVisible(true);
                  let data = {};
                      data.id = Date.now().toString();
                      data.eye = eye == 'OG' ? 'LEFT' : 'RIGHT' ;
                      data.stade = selected;
                      data.medcinId = medcinId ;
                      data.images = [];
                      data.date_acquisition = new Date(parseInt(data.id , 10)).toISOString().slice(0, 10);

                  savedImages.forEach((file, index) => {
                    data.images.push({
                      name:
                        "image_" +
                        index +
                        "_" +
                        selected +
                        "_" +
                        file.eye +
                        ".jpg",
                      type: "image/jpg",
                      uri:
                        Platform.OS === "ios"
                          ? file.uri.replace("file://", "")
                          : file.uri,
                    });
                  });

                  let newImagesLinks = [];

                  const album = await MediaLibrary.getAlbumAsync('retinia');

                  // console.log('album' , album);

                  for(let item of data.images) {

                    const asset = await MediaLibrary.createAssetAsync(item.uri);
                    asset.uri = "file:///storage/emulated/0/Pictures/retinia/"+asset.filename ;
                    // console.log('asset',asset);

                    if (album == null) {
                      const cAlbum = await MediaLibrary.createAlbumAsync('retinia', asset, false);
                    } else {
                      await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
                    }

                    // const newAsset = await MediaLibrary.getAssetInfoAsync(asset);
                    // console.log('new asset' , newAsset);
                    newImagesLinks.push(asset.uri);

                  }

                  data.images=newImagesLinks
                  console.log('new data', data );



                    // saveItem(globalConsts.alias.INDEXATION,null );

                    const storedData = await getItem(globalConsts.alias.INDEXATION).catch((error)=>{
                      console.log(error);
                      displayStoreError();
                    });
                    if(storedData == null || storedData.length == 0) {
                      await saveItem(globalConsts.alias.INDEXATION, [data]).then(()=>{
                        console.log('data stored successfully');
                        setLoaderVisible(false);
                        displaySuccess();

                      }).catch(((error) =>{
                        console.log(error);
                        setLoaderVisible(false);
                        displayStoreError()
                      }));
                    } else {
                      await saveItem(globalConsts.alias.INDEXATION, [...storedData , data]).then(()=>{
                        console.log('data stored successfully');
                        setLoaderVisible(false);
                        displaySuccess();
                      }).catch(((error) =>{
                        console.log(error);
                        setLoaderVisible(false);
                        displayStoreError()
                      }));
                    }
                    const status = await getItem(globalConsts.alias.INDEXATION);
                    console.log("nombre d'indexations",status.length);



                },
              },
              { text: "Annuler", onPress: () => null },
            ]
          );
          askPermission();
        }
      })
      .catch((erro) => {
        console.log(error);
      });
  };

  const clearAndGoBack = () => {
    // dispatch(setImages([]));
    setSavedImages([]);
    navigation.replace("IndexationEntryScreen");
  };
  // save image for the right eye

  if (!isFocused || hasCameraPermission === null) {
    return <View />;
  }

  if (hasCameraPermission === false) {
    return <Text>No Camera Access </Text>;
  }

  const shownButtonV2 = (
    <View style={{}}>
      <View
        style={[
          styles.buttonContainer,
          { flexDirection: "row", justifyContent: "space-around", height: 50 },
        ]}
      >
        <IndexationButton
          title="ND"
          value={stades["ND"]}
          selected={selected}
          onPress={() => handleSelect(stades["ND"])}
        />

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
      </View>

      <View
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "row",
        }}
      >
        <View style={{ paddingStart: 15, width: 50 }}>
          <Text style={{ color: "white", fontSize: 25 }}>
            {savedImages.length}
          </Text>
        </View>
        <View style={{ flex: 1, display: "flex", alignItems: "center" }}>
          <TouchableOpacity onPress={() => takePicture()} style={styles.button}>
            <Icon.Aperture stroke="#000" width={32} height={32} />
            <Text style={{ fontSize: 20, marginLeft: 10 }}>Capturer</Text>
          </TouchableOpacity>
          <View
            style={{
              height: 50,
              padding: 0,
              margin: 0,
              width: 150,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {savedImages.length >= LIMIT && (
              <TouchableOpacity
                // onPress={() => navigation.navigate("IndexationDetails" , savedImages)}
                onPress={upload}
                style={[styles.buttonSave, { width: "100%", height: "100%" }]}
              >
                {/* <Ionicons
                  name="arrow-forward-outline"
                  size={22}
                  color="white"
                  style={{ marginStart: 6 }}
                /> */}
                <Text style={{ fontSize: 20, marginLeft: 10, color: "white" }}>
                  Sauvegarder
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View
          style={{
            width: 50,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => selectEye("OD")}
            style={{
              flex: 1,
              marginVertical: 5,
              width: "100%",
              backgroundColor:
                eye == "OD" ? globalConsts.colors.primaryColor : "white",
              borderRadius: 7,
              alignItems: "center",
              justifyContent: "center",
              marginRight: 10,
            }}
          >
            <Text
              style={{ fontSize: 20, color: eye == "OD" ? "white" : "black" }}
            >
              OD
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => selectEye("OG")}
            style={{
              flex: 1,
              marginVertical: 5,
              width: "100%",
              backgroundColor: "#fff",
              borderRadius: 7,
              alignItems: "center",
              justifyContent: "center",
              marginRight: 10,
              backgroundColor:
                eye == "OG" ? globalConsts.colors.primaryColor : "white",
            }}
          >
            <Text
              style={{ fontSize: 20, color: eye == "OG" ? "white" : "black" }}
            >
              OG
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.cameraSc}>
      <LoaderModal visible={loaderVisible} />
      <View style={styles.cameraContainer}>
        <Camera
          ref={(ref) => setCamera(ref)}
          style={styles.fixedRatio}
          type={type}
          ratio={"1:1"}
        />
      </View>

      {/* {shownButton} */}
      {shownButtonV2}
      <View style={styles.images}>
        <NativeBaseProvider>
          <ScrollView horizontal={true}>
            <HStack style={{ flexDirection: "row-reverse" }}>
              {savedImages.length > 0 &&
                savedImages.map((img, i) => (
                  <Pressable
                    // onPress={() => deleteImage(img)}
                    onPress={() => deleteImageAlert(img)}
                    key={i}
                    style={{
                      borderColor: img.eye == "OD" ? "white" : "green",
                      borderWidth: 1,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 8,
                      marginHorizontal: 2,
                    }}
                  >
                    <Image
                      resizeMode="contain"
                      source={{
                        uri: img.uri,
                      }}
                      // mx="2"
                      m={1}
                      borderRadius="8"
                      alt="Alternate Text"
                      size="sm"
                    />
                  </Pressable>
                ))}
            </HStack>
          </ScrollView>
        </NativeBaseProvider>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginVertical: 10,
    backgroundColor: globalConsts.colors.secondaryColor,
    borderRadius: 15,
    marginHorizontal: 15,
    borderColor: globalConsts.colors.greyText,
    borderWidth: 0.4,
    overflow: "hidden",
  },
  cameraSc: {
    flex: 1,
    backgroundColor: "#000",
  },
  cameraContainer: {
    flex: 1,
    flexDirection: "row",
    borderColor: "#fff",
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 20,
  },
  images: {
    width: "100%",
    height: 100,
    padding: 10,
    display: "flex",
    flexDirection: "column",
  },
  button: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: globalConsts.colors.secondaryColor,
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: "auto",
    marginVertical: 5,
    width: "50%",
  },
  buttonDis: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red",
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: "auto",
    marginVertical: 5,
    width: "50%",
  },
  buttonSave: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: globalConsts.colors.primaryColor,
    borderRadius: 10,
  },
});
