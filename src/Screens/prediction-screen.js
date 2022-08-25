import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
  Image,
  Pressable,
  Platform,
} from "react-native";
import React, { useState, useEffect } from "react";
import { globalStyles } from "../Globals/global-styles";
import { globalConsts } from "../Globals/global-const";
import Header from "../Components/header";
import AppButton from "../Components/app-button";
import { useDispatch, useSelector } from "react-redux";
import ImageView from "react-native-image-viewing";
import { useStateIfMounted } from "use-state-if-mounted";
import Checkbox from "expo-checkbox";
import { authPost, fileAuthPost, get } from "../Services/http-service";
import { getItem } from "../Services/store-service";
import LoaderModal from "../Components/loader";

export default function PredictionPage({ route , navigation }) {
  const reduxLeftEye = useSelector((state) => {
    return state.images.images
      .filter((item) => item.eye === "OD")
      .map((item, index) => {
        return {
          eye: "OD",
          uri: item.image,
          id: index,
        };
      });
  });
  const reduxRightEye = useSelector((state) => {
    return state.images.images
      .filter((item) => item.eye === "OG")
      .map((item, index) => {
        return {
          eye: "OG",
          uri: item.image,
          id: index,
        };
      });
  });

  // const [selectedImages , setSelectedImages] = useState([]);
  const [rightEye, setRightEye] = useStateIfMounted(null);
  const [leftEye, setLeftEye] = useStateIfMounted(null);
  const [leftEyeIndex, setLeftEyeIndex] = useState(0);
  const [rightEyeIndex, setRightEyeIndex] = useState(0);
  const [leftEyeModelVisibility, setLeftEyeModelVisibility] = useState(false);
  const [rightEyeModelVisibility, setRightEyeModelVisibility] = useState(false);
  const [selectedRightEyeImages, setSelectedRightEyeImages] = useStateIfMounted([]);
  const [selectedLeftEyeImages, setSelectedLeftEyeImages] = useStateIfMounted([]);
  const [medcinId, setMedcinId] = useStateIfMounted(null);
  const [token, setToken] = useStateIfMounted(null);
  const [loaderVisible , setLoaderVisible ] = useState(false);


  const handleImageSelectedRight = (item) => {
    setSelectedRightEyeImages((items) => {
      if (items.filter((newItem) => newItem.id == item.id).length > 0) {
        console.log("right item included", item.id);
        return [...items.filter((newItem) => newItem.id != item.id)];
      } else {
        console.log("right item non included", item.id);
        return [...items, item];
      }
    });
  };
  const handleImageSelectedLeft = (item) => {
    setSelectedLeftEyeImages((items) => {
      if (items.filter((newItem) => newItem.id == item.id).length > 0) {
        console.log("left item included", item.id);
        return [...items.filter((newItem) => newItem.id != item.id)];
      } else {
        console.log("left item non included", item.id);
        return [...items, item];
      }
    });
  };

  // useEffect(() => {
  //   console.log(
  //     "===================================================\\n",
  //     selectedRightEyeImages.length
  //   );
  // }, [selectedRightEyeImages]);

  const openRightModal = (index) => {
    setRightEyeIndex(index);
    setRightEyeModelVisibility(true);
  };

  const openLeftModal = (index) => {
    setLeftEyeIndex(index);
    setLeftEyeModelVisibility(true);
  };

  useEffect(() => {
    setRightEye(reduxRightEye);
    setLeftEye(reduxLeftEye);
    setSelectedLeftEyeImages([]);
    setSelectedRightEyeImages([]);
    (async () => {
      setMedcinId(await getItem(globalConsts.alias.USER));
      setToken(await getItem(globalConsts.alias.TOKEN));
    })();
  }, []);

  const stadeEnum =  [
    'PAS_DE_RD',
    'RDNP_MINIME',
    'RDNP_MODEREE',
    'RDNP_SEVERE',
    'RD_TRAITEE_NON_ACTIVE'
  ]

  const alert = () => {
    Alert.alert("Confirmation", "Vous etes sure que vous voulez envoyer les donnees", [
      {
        text: "Annuler",
        onPress: () => console.log("Cancel Pressed"),
        // style: "cancel",
      },
      {
        text: "Confirmer",
        // onPress: () => navigation.navigate("GenerateRapport" , {
        //   right : selectedRightEyeImages ,
        //   left : selectedLeftEyeImages , 
        //   predictionOD : stadeEnum[0] ,
        //   predictionOG : stadeEnum[2] ,

        // } ),
        // onPress: () => {
        //   upload();
        // },
        onPress : () => uplaadV2()
      },
    ]);
  };

  const onBackPressed = () => {
    navigation.goBack();
  };

  const upload = () => {
    let data = new FormData();
    const textData = {
      id: 1,
      other: "test",
    };
    // data.append('data' , textData )

    selectedRightEyeImages.forEach((file, index) => {
      data.append("images", {
        name: file.eye+"image_" + index + "_" + file.eye + ".jpg",
        type: "image/jpg",
        uri: Platform.OS === "ios" ? file.uri.replace("file://", "") : file.uri,
      });
    });

    selectedLeftEyeImages.forEach((file, index) => {
      data.append("images", {
        name: file.eye+"image_" + index + "_" + file.eye + ".jpg",
        type: "image/jpg",
        uri: Platform.OS === "ios" ? file.uri.replace("file://", "") : file.uri,
      });
    });

    fileAuthPost(globalConsts.links.FAST_API, data, "predict")
      .then((res) => {
        console.log(res.data);
        navigation.navigate("GenerateRapport", {
          right: selectedRightEyeImages,
          left: selectedLeftEyeImages,
          predictionOD : res.data.OD ,
          predictionOG : res.data.OG ,
        });
      })
      .catch((error) => console.log(error));
    // get(null ,"test").then(data=>console.log(data.data)).catch(error => console.log(error) )
    // console.log(data);
  };

  const stades = {
    'ABS': "PAS_DE_RD",
    '1': "RDNP_MINIME",
    '2': "RDNP_MODEREE",
    '3': "RDNP_SEVERE",
    '4': "RD_TRAITEE_NON_ACTIVE",
  };

  const uplaadV2 = () => {
      var data = new FormData();

      // data.append('sod' , stadeEnum[0])
      // data.append('sog' , stadeEnum[1])
      // if(data.has('sod'))  
      // if(data.has('sog')) 
      // if(data.has('images')) 
      // data.delete('images')
      // data.delete('sog');
      // data.delete('sod');

  
      selectedRightEyeImages.forEach((file, index) => {
        data.append("images", {
          name: file.eye+"image_" + index + "_" + file.eye + ".jpg",
          type: "image/jpg",
          uri: Platform.OS === "ios" ? file.uri.replace("file://", "") : file.uri,
        });
      });
  
      selectedLeftEyeImages.forEach((file, index) => {
        data.append("images", {
          name: file.eye+"image_" + index + "_" + file.eye + ".jpg",
          type: "image/jpg",
          uri: Platform.OS === "ios" ? file.uri.replace("file://", "") : file.uri,
        });
      });
      setLoaderVisible(true)

      fileAuthPost(null , globalConsts.links.FAST_API, data, "predict")
      .then((res) => {
        console.log(res.data);

        data.append('sod' , stades[res.data.OD]);
        data.append('sog' , stades[res.data.OG]);
        console.log(data);
        console.log('medcins/'+medcinId+'/patients/'+route.params.id+'/addControl');
        fileAuthPost(token ,globalConsts.links.SPRING_API , data , 'medcins/'+medcinId+'/patients/'+route.params.id+'/addControl')
        .then((res) => {
          console.log(res.data);
          setLoaderVisible(false)
          navigation.replace("GenerateRapport", {
            idPatient : route.params.id ,
            idControl : res.data
          });
        })
        .catch((error) => { 
          console.log(error) ;
          setLoaderVisible(false) ; displayError();
        }
        );

      })
      .catch((error) => {console.log(error) ;
         setLoaderVisible(false)
         displayErrorFast();
      } );

      const displayErrorFast = () => {
        Alert.alert("Avertisement !", "probleme de prediction", [
          {
            text: "Ok",
            onPress: () => { null },
            // style: "cancel"
          },
          // { text: "Annuler", onPress:() => clearAndGoBack() }
        ]);
      }
      const displayError = () => {
        Alert.alert("Avertisement !", "probleme de connexion", [
          {
            text: "Ok",
            onPress: () => { null },
            // style: "cancel"
          },
          // { text: "Annuler", onPress:() => clearAndGoBack() }
        ]);
      }


  }

  return (
    <View style={[globalStyles.safeArea, globalStyles.full, styles.container]}>
      <Header title="Controle" onBackPress={onBackPressed} />
      <View style={styles.body}>
        <View style={[styles.infoCard]}>
          <View>
            <Text style={[styles.headerText]}>{ route.params.prenom + ' ' + route.params.nom }</Text>
            {/* <Text style={[styles.text]}>21/02/1989</Text> */}
          </View>
          {/* <View>
            <Text style={[styles.headerText]}> médecin traitant</Text>
            <Text style={[styles.text]}> Harry Maguire</Text>
          </View> */}
        </View>
        <View style={[styles.samplesContainer]}>
          <View style={[{ flex: 1 }]}>
            <View style={[styles.listHeader]}>
              <Text style={{ fontWeight: "bold" }}>OG</Text>
            </View>
            <ScrollView
              style={[{ flex: 1 }]}
              contentContainerStyle={{ marginHorizontal: 10 }}
            >
              {reduxLeftEye.map((item, i) => (
                <Pressable
                  onLongPress={() => handleImageSelectedLeft(item)}
                  key={i}
                  style={{ width: "100%", aspectRatio: 1, padding: 5 }}
                  onPress={() => openLeftModal(i)}
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
                  <Checkbox
                    onValueChange={(target, value) =>
                      handleImageSelectedLeft(item)
                    }
                    value={
                      selectedLeftEyeImages.filter(
                        (newItem) => newItem.id == item.id
                      ).length > 0
                    }
                    color={globalConsts.colors.primaryColor}
                    style={{ position: "absolute", right: 15, top: 15 }}
                  />
                </Pressable>
              ))}
            </ScrollView>
          </View>

          <View style={[{ flex: 1 }]}>
            <View style={[styles.listHeader]}>
              <Text style={{ fontWeight: "bold" }}>OD</Text>
            </View>
            <ScrollView
              style={[{ flex: 1 }]}
              contentContainerStyle={{ marginHorizontal: 10 }}
            >
              {reduxRightEye.map((item, i) => (
                <Pressable
                  onLongPress={() => handleImageSelectedRight(item)}
                  key={i}
                  style={{ width: "100%", aspectRatio: 1, padding: 5 }}
                  onPress={() => openRightModal(i)}
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
                  <Checkbox
                    onValueChange={(target, value) =>
                      handleImageSelectedRight(item)
                    }
                    value={
                      selectedRightEyeImages.filter(
                        (newItem) => newItem.id == item.id
                      ).length > 0
                    }
                    color={globalConsts.colors.primaryColor}
                    style={{ position: "absolute", right: 15, top: 15 }}
                  />
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>

        <AppButton
          title="Traitement"
          bgColor={globalConsts.colors.primaryColor}
          bdrColor={globalConsts.colors.primaryColor}
          fontColor="#fff"
          onPress={alert}
        />
      </View>

      <LoaderModal visible={loaderVisible} />

      <ImageView
        isSwipeCloseEnabled={true}
        isPinchZoomEnabled={true}
        isTapZoomEnabled={true}
        images={leftEye}
        imageIndex={leftEyeIndex}
        visible={leftEyeModelVisibility}
        onRequestClose={() => setLeftEyeModelVisibility(false)}
      />

      <ImageView
        isSwipeCloseEnabled={true}
        isPinchZoomEnabled={true}
        isTapZoomEnabled={true}
        images={rightEye}
        imageIndex={rightEyeIndex}
        visible={rightEyeModelVisibility}
        onRequestClose={() => setRightEyeModelVisibility(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listHeader: {
    // width : '100%' ,
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
    justifyContent: "center",
    borderColor: globalConsts.colors.greyText,
    borderWidth: 0.4,
  },
  body: {
    paddingVertical: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: globalConsts.colors.helperColor,
    flex: 1,
  },
  samplesContainer: {
    backgroundColor: globalConsts.colors.secondaryColor,
    // paddingHorizontal : 0 ,
    margin: 15,
    borderRadius: 10,
    flex: 1,
    flexDirection: "row",
  },
  box: {
    height: 250,
    marginTop: 150,
    backgroundColor: "#1f65ff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  container2: {
    paddingTop: 5,
    paddingHorizontal: 30,
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
    marginStart: 5,
  },
});
