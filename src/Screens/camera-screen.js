import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  BackHandler , 
  Alert
} from "react-native";
import React from "react";
import { Camera } from "expo-camera";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  HStack,
  Image,
  NativeBaseProvider,
  ScrollView,
} from "native-base";

import * as Icon from "react-native-feather";
import { globalConsts } from "../Globals/global-const";
import { useDispatch, useSelector } from "react-redux";
import { setImages } from "../Reducers/images-reducer";
import { useStateIfMounted } from "use-state-if-mounted";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";

export default function CameraScreen({ route , navigation }) {

  const LIMIT = 4;

  const dispatch = useDispatch();
  const reduxImages = useSelector((state) => {
    return state.images.images;
  });

  // if the compoenet if focused or not
  const isFocused = useIsFocused();

  //states
  //check camera permission
  const [hasCameraPermission, setHasCameraPermission] = useStateIfMounted(null);
  const [camera, setCamera] = useState(null);
  // the last captured image
  const [image, setImage] = useState(null);
  // the camera type
  const [type, setType] = useState(Camera.Constants.Type.back);
  // boolean to check if we have an image in the qeueu
  const [captured, setCaptured] = useState(false);
  // boolean to check if we should display the next button
  const [showNext, setShowNext] = useStateIfMounted(false);
  // all the captured images
  const [savedImages, setSavedImages] = useStateIfMounted([]);

  // To customize the back behavior
  const clearAndGoBack = () => {
    dispatch(setImages([]));
    navigation.replace('EntryPage');
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        Alert.alert("Avertissement !", "Êtes-vous sûre que vous voulez annuler le contrôle", [
          {
            text: "Rester",
            onPress: () => { null },
            // style: "cancel"
          },
          { text: "Quitter", onPress:() => clearAndGoBack() }
        ]);
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    } ,[])
  );

  const deleteImageAlert = (image) => {
    Alert.alert("Avertissement !", "Supprimer l'image ?", [
      {
        text: "Non",
        onPress: () => { null },
        // style: "cancel"
      },
      { text: "Oui", onPress:() => deleteImage(image) }
    ]);
  }

  // delete image from the state
  const deleteImage = (image) => {
    const newImages = savedImages.filter((img) => img != image);
    dispatch(setImages(newImages));
    setSavedImages(newImages);
    if (savedImages.length >= LIMIT) {
      setShowNext(true);
    } else {
      setShowNext(false);
    }
  };



    // check the camera permission on the app start
    useEffect(() => {
      // AsyncStorage.setItem("@pictures", JSON.stringify(savedImages));
      (async () => {
        const cameraStatus = await Camera.requestCameraPermissionsAsync();
        setHasCameraPermission(cameraStatus.status === "granted");
      })();
      setSavedImages(reduxImages)

    }, []);
  
    // on saved image change
    // save the images at every change image capture
    useEffect(() => {
      (function () {
        console.log("state images", savedImages);
        console.log("redux images", reduxImages);
        console.log("images count ", savedImages.length);
  
        if (savedImages.length >= LIMIT) {
          setShowNext(true);
        } else {
          setShowNext(false);
        }
        console.clear();
      })();
    }, [savedImages]);




  // capture an image
  const takePicture = async () => {
    if (camera) {
      const option = { quality: 1, based64: true, skipProcessing: false  };
      try {
        const data = await camera.takePictureAsync(option);
        setCaptured(true);
        setImage(data.uri);
      } catch (err) {
        console.log(err);
      }
    }
  };

  //add image to the state
  const addImage = (image) => {
    const newImages = [...savedImages, image];
    dispatch(setImages(newImages));
    setSavedImages(newImages);
  };

  // save image for left eye
  const saveLeftEye = () => {
    setCaptured(false);
    const leftEye = {
      image,
      eye: "OG",
    };
    addImage(leftEye);
    if (savedImages.length >= LIMIT) {
      setShowNext(true);
    }
  };

  // save image for the right eye
  const SaveRightEye = () => {
    setCaptured(false);
    const rightEye = {
      image,
      eye: "OD",
    };
    addImage(rightEye);
    if (savedImages.length >= LIMIT) {
      setShowNext(true);
    }
  };

  //Dismiss image
  const rejectImage = () => {
    setCaptured(false);
    if (savedImages.length >= LIMIT) {
      setShowNext(true);
    } else {
      setShowNext(false);
    }
  };

  if (!isFocused || hasCameraPermission === null) {
    return <View />;
  }

  if (hasCameraPermission === false) {
    return <Text>No Camera Access </Text>;
  }
  let shownButton;
  if (captured) {
    shownButton = (
      <View style={{ display: "flex", alignItems: "center" }}>
        <TouchableOpacity onPress={() => saveLeftEye()} style={styles.button}>
          <Text style={{ fontSize: 20, marginLeft: 10 }}>OG</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => SaveRightEye()} style={styles.button}>
          <Text style={{ fontSize: 20, marginLeft: 10 }}>OD</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => rejectImage()}
          style={styles.buttonDis}
        >
          <Text style={{ fontSize: 20, marginLeft: 10, color: "white" }}>
            Annuler
          </Text>
        </TouchableOpacity>
      </View>
    );
  } else {
    if (!captured && !showNext) {
      shownButton = (
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
          <TouchableOpacity onPress={() => takePicture()} style={styles.button}>
            <Icon.Aperture stroke="#000" width={32} height={32} />
            <Text style={{ fontSize: 20, marginLeft: 10 }}>Capturer</Text>
          </TouchableOpacity>
          <View style={{ width: 50 }}></View>
        </View>
      );
    }
    if (!captured && showNext) {
      shownButton = (
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
            <TouchableOpacity
              onPress={() => takePicture()}
              style={styles.button}
            >
              <Icon.Aperture stroke="#000" width={32} height={32} />
              <Text style={{ fontSize: 20, marginLeft: 10 }}>Capturer</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>{
                console.log(route.params.id , route.params.nom , route.params.prenom )
                navigation.navigate("PredictionPage" , { id : route.params.id , nom : route.params.nom , prenom : route.params.prenom})
              } }
              style={styles.buttonSave}
            >
              <Icon.ArrowRight stroke="#000" width={32} height={32} />
              <Text style={{ fontSize: 20, marginLeft: 10 }}>Suivant</Text>
            </TouchableOpacity>
          </View>
          <View style={{ width: 50 }}></View>
        </View>
      );
    }
  }
  
  return (
    <View style={styles.cameraSc}>
      <View style={styles.cameraContainer}>
        <Camera
          ref={(ref) => setCamera(ref)}
          style={styles.fixedRatio}
          type={type}
          ratio={"1:1"}
        />
      </View>

      {shownButton}
      <View style={styles.images}>
        <NativeBaseProvider>
          <ScrollView horizontal={true}>
            <HStack style={{ flexDirection: "row-reverse" }}>
              {savedImages.length > 0 &&
                savedImages.map((img, i) => (
                  <Pressable
                    onPress={() => deleteImageAlert(img)}
                    key={i}
                    style={{
                      borderColor: img.eye == "OD" ? "blue" : "green",
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
                        uri: img.image,
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
    backgroundColor: "#DDDDDD",
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
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#33BBEE",
    paddingVertical: 8,
    borderRadius: 10,
    marginHorizontal: "auto",
    marginVertical: 5,
    width: "50%",
  },
});
