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
    PermissionsAndroid,
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
  import { getItem, saveItem } from "../Services/store-service";
  import { authGet, authPost, fileAuthPost } from "../Services/http-service";
  import axios from "axios";
  import { useFocusEffect } from "@react-navigation/native";
  import LoaderModal from "../Components/loader";
  import * as Permissions from 'expo-permissions' ;
  import * as FileSystem from 'expo-file-system';
  import * as MediaLibrary from 'expo-media-library';


  
  export default function IndexationDetailsInterne({ route, navigation }) {
    const [visible, setIsVisible] = useState(false);
    const [selected, setSelected] = useState("NOT DEFINED");
    const [imageIndex, setImageIndex] = useState(0);
    const [selectedImages, setSelectedImages] = useStateIfMounted([]);
    const [medcinId, setMedcinId] = useStateIfMounted(null);
    const [token, setToken] = useStateIfMounted(null);
    const [indexation, setIndexation] = useStateIfMounted(null);
    const [loaderVisible, setLoaderVisible] = useState(false);
  
  
    const stades = {
      'ND' : 'NOT_INDEXED' , 
      'ABS': "PAS_DE_RD",
      '1': "RDNP_MINIME",
      '2': "RDNP_MODEREE",
      '3': "RDNP_SEVERE",
      '4': "RD_TRAITEE_NON_ACTIVE",
    };

    const stadeInv = {
      'NOT_INDEXED' : 'ND' , 
      "PAS_DE_RD" : 'ABS',
      "RDNP_MINIME" : '1' ,
      "RDNP_MODEREE" : '2',
      "RDNP_SEVERE" : '3' ,
      "RD_TRAITEE_NON_ACTIVE" : '4'
    }
  
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
          navigation.replace('IndexationListInterne');
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

        // Permissions.askAsync(Permissions.CAMERA_ROLL);
        // if (status === 'granted') {
        // } else {
        // /// Handle permissions denied;
        // console.log('Uh oh! The user has not granted us permission.');
        // }

        const requestCameraPermission = async () => {
            try {
              const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
              );
              if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("You can use the storage");
              } else {
                console.log("storage permission denied");
              }
            } catch (err) {
              console.warn(err);
            }
          };

          requestCameraPermission();



      })();
    }, []);
  
    useEffect(() => {
      if (medcinId != null && token != null) {
        fetchData();
      }
    }, [medcinId, token]);
  
    const fetchData = async () => {

        var tmp = {};

        const images = await FileSystem.readDirectoryAsync(route.params.id);
        // const res = await FileSystem.getInfoAsync(route.params.id);
        // console.log('id', route.params.id.split('/').slice(-2,-1).pop().slice(-1));
        // console.log('eye',route.params.id.split('/').pop().slice(-1));
        // tmp.eye = route.params.id.split(',').pop().slice(0, 1) == "L" ? 'LEFT' : 'RIGHT'; 
        tmp.eye = route.params.id.split('/').slice(-2,-1).pop().slice(-1) == "L" ? "LEFT" : "RIGHT";
        tmp.stade = 'NOT_INDEXED';
        tmp.medcinId = medcinId ;
        tmp.images = [];
        tmp.id = route.params.id;

        

        for(let imgIndex in images){
            tmp.images.push(route.params.id+'/'+images[imgIndex]);
        }

        console.log(tmp);

        setSelected('NOT_INDEXED');
        setIndexation(tmp);
        setSelectedImages(

            tmp.images.map((image) => {
              return {
                uri: image,
              };
            })

        );

    };
  
  
    const submit = () => {

        // editOrRemove();
      setLoaderVisible(true);
      let data = new FormData();
      // data.append('data' ,  )

      indexation.images.forEach((file, index) => {
        data.append("images", {
          name: "image_" + index + "_" + selected + "_" + indexation.eye == 'RIGHT' ? 'OD':'OG' + ".jpg",
          type: "image/jpg",
          uri:
            Platform.OS === "ios"
              ? file.replace("file://", "")
              : file,
        });
      });
      data.append("medcinID", medcinId);
      data.append("eye", indexation.eye);
      data.append("stade", selected);
      console.log(data);

      fileAuthPost(
        token,
        globalConsts.links.SPRING_API,
        data,
        "Echantillon/Acquisition"
      )
        .then(async (res) => {
          console.log(res.data);
          editOrRemove();

        })
        .catch((error) => {
          console.log(error);
          setLoaderVisible(false);
          displayError();
        });
      
    };

    const edit = async () => {
      Alert.alert(
        "Avertissement !",
        "vous êtes sure que vous voulez modifier ?",
        [
          {
            text: "OUI",
            onPress: async () => {

                setIndexation({ ...indexation, stade: selected });
                console.log(indexation);

                const storedData = await getItem(globalConsts.alias.INDEXATION).catch((error)=>{
                  console.log(error);
                  displayStoreError();
                });

                if(storedData == null || storedData.length == 0) {
                  await saveItem(globalConsts.alias.INDEXATION, [{ ...indexation , stade: selected }]).then(()=>{
                    console.log('data stored successfully');
                    displaySuccess();
                  }).catch(((error) =>{
                    console.log(error);
                    displayStoreError()
                  }));
                } else {
                  await saveItem(globalConsts.alias.INDEXATION, [ ...storedData.map( item => {
                    if(item.id == route.params.id){
                      return {...item , stade: selected};
                    }
                    return item ;

                  })  ]).then(()=>{
                    console.log('data stored successfully');
                    displaySuccess();
                  }).catch(((error) =>{
                    console.log(error);
                    displayStoreError()
                  }));
                }
                const status = await getItem(globalConsts.alias.INDEXATION);
                console.log("nombre d'indexations",status.length);

              }


          },
          
          { text: "Annuler", onPress: () => null },
        ]
      );
    }

    const remove = async () => {
      Alert.alert(
        "Avertissement !",
        "vous êtes sure que vous voulez supprimer ?",
        [
          {
            text: "OUI",
            onPress: async () => {

                // setIndexation({ ...indexation, stade: selected });
                // console.log(indexation);

                const storedData = await getItem(globalConsts.alias.INDEXATION).catch((error)=>{
                  console.log(error);
                  displayStoreError();
                });

                if(storedData == null || storedData.length == 0) {
                  await saveItem(globalConsts.alias.INDEXATION, []).then(()=>{
                    console.log('data stored successfully');
                    displaySuccess();
                  }).catch(((error) =>{
                    console.log(error);
                    displayStoreError()
                  }));
                } else {
                  await saveItem(globalConsts.alias.INDEXATION, [ ...storedData.filter( item => item.id !== route.params.id ) ]).then(()=>{
                    console.log('data stored successfully');
                    displaySuccess();

                  }).catch(((error) =>{
                    console.log(error);
                    displayStoreError()
                  }));
                }
                const status = await getItem(globalConsts.alias.INDEXATION);
                console.log("nombre d'indexations",status.length);

              }


          },
          
          { text: "Annuler", onPress: () => null },
        ]
      );
    }

    

    const editOrRemove = async () => {
        const slices = route.params.id.split('/').slice(-2 , -1)
        console.log(slices);

        const storedData = await getItem(globalConsts.alias.INDEXED).catch((error)=>{
          console.log(error);
          setLoaderVisible(false);
          displayStoreError();
          return ;
        });
        if(storedData == null || storedData.length == 0) {
          await saveItem(globalConsts.alias.INDEXED, [slices[0]]).then(()=>{
            console.log('data stored successfully');
            setLoaderVisible(false);
            displaySuccess();

          }).catch(((error) =>{
            console.log(error);
            setLoaderVisible(false);
            displayStoreError()
          }));
        } else {

          await saveItem(globalConsts.alias.INDEXED, [...storedData , slices[0]]).then(()=>{
            console.log('data stored successfully');
            setLoaderVisible(false);
            displaySuccess();
          }).catch(((error) =>{
            console.log(error);
            setLoaderVisible(false);
            displayStoreError()
          }));
        }
        const status = await getItem(globalConsts.alias.INDEXED);
        console.log("nombre d'indexations",status.length);


        // console.log(route.params.id.split('/').slice(-2));
        // await FileSystem.moveAsync({
        //     from : route.params.id+'/P_0001R_R[ OD]2022-06-22-16-13-000.jpg' ,
        //     to : 'file:///storage/emulated/0/Indexed/'+ slices[0]
        // }).then(res => console.log('success' , res)).catch(err => console.log('error' , err));

        // for(let item of indexation.images){
        //     // console.log(item);
        //     await FileSystem.deleteAsync(item).then(res => console.log('success' , res)).catch(err => console.log('error' , err));

        // }

        // MediaLibrary.getAlbumsAsync().then(res => console.log('success' , res)).catch(err => console.log('error' , err));
        // const asset = await MediaLibrary.createAssetAsync('file:///storage/emulated/0/DCIM/P_0001R/20220622/P_0001R_R[ OD]2022-06-22-16-13-000prev.jpg').then(res => console.log('success' , res)).catch(err => console.log('error' , err));
        // MediaLibrary.deleteAssetsAsync('1793').then(res => console.log('success' , res)).catch(err => console.log('error' , err));
        // MediaLibrary.deleteAlbumsAsync('-2075821635').then(res => console.log('success' , res)).catch(err => console.log('error' , err));
        // MediaLibrary.getAssetInfoAsync("file:///storage/emulated/0/DCIM/P_0001R_R[ OD]2022-06-22-16-13-000prev.jpg").then(res => console.log('success' , res)).catch(err => console.log('error' , err));
        // const album = await MediaLibrary.getAlbumAsync("20220622").then(res => console.log('success' , res)).catch(err => console.log('error' , err));
        // MediaLibrary.getAssetsAsync({album : album}).then(res => console.log('success' , res)).catch(err => console.log('error' , err));
      
    }
  
    const displayStoreError = () => {
      Alert.alert("Avertissement !", "problème de sauvegarde", [
        {
          text: "Ok",
          onPress: () => {
            null;
          },
        },
      ]);
    };
  
    const displaySuccess = () => {
      Alert.alert("Félicitation !", "l'opération s'est bien passé", [
        {
          text: "Ok",
          onPress: () => {
            navigation.replace("IndexationListInterne");
          },
        },
      ]);
    };

    const displayError = () => {
      Alert.alert("Avertissement !", "problème de connexion", [
        {
          text: "Ok",
          onPress: () => { null },
        },
      ]);
    }

    
  
    const handleSelect = (value) => {
      setSelected(value);
      // console.log(value);
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
                        <Text style={[styles.text]}>{indexation.eye == null ? 'Non defini' : (indexation.eye == 'RIGHT' ? 'OD' : 'OG') }</Text>
                      </View>
                    </View>
                    <View
                      style={[
                        styles.buttonContainer,
                        { flexDirection: "row", justifyContent: "space-around" },
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
                            {indexation.eye == null ? 'Non defini' : (indexation.eye == 'RIGHT' ? 'OD ' : 'OG ') }
                            (Oeil {indexation.eye == null ? 'Non defini' : (indexation.eye == 'RIGHT' ? 'droite' : 'gauche') })
                          </Text>
                        </View>
                        <View
                          style={[styles.samplesList, { paddingVertical: 5 }]}
                        >
                          {indexation.images.map((image, index) => (
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
                                    uri: image,
                                  }}
                                />
                              </TouchableOpacity>
                            </View>
                          ))}
                        </View>
                      </View>
                    </View>
                    {/* <View style={{ marginVertical : 3 }}>
                      <AppButton
                        title="Sauvegarder"
                        bgColor={globalConsts.colors.primaryColor}
                        bdrColor={globalConsts.colors.primaryColor}
                        fontColor="#fff"
                        onPress={edit}
                      />
                    </View> */}
                    <View style={{ marginVertical : 3 }}>
                      <AppButton
                        title="Envoyer"
                        bgColor={globalConsts.colors.secondaryColor}
                        bdrColor={globalConsts.colors.primaryColor}
                        fontColor={globalConsts.colors.primaryColor}
                        onPress={submit}
                      />
                    </View>
                    {/* <View style={{ marginVertical : 3 }}>
                      <AppButton
                        title="Supprimer"
                        bgColor={globalConsts.colors.secondaryColor}
                        bdrColor='red'
                        fontColor="red"
                        onPress={remove}
                      />
                    </View> */}



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
  