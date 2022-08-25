import {
    StyleSheet,
    View,
    ScrollView,
    Text,
    BackHandler,
    Alert
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import { globalStyles } from "../Globals/global-styles";
  import { globalConsts } from "../Globals/global-const";
  import Header from "../Components/header";
  import CustomSearchBar from "../Components/search-bar";
  import { FloatingAction } from "react-native-floating-action";
  import PatientCard from "../Components/patient-card";
  import IndexationCard from "../Components/indexation-card";
  import { useStateIfMounted } from "use-state-if-mounted";
  import { getItem, saveItem } from "../Services/store-service";
  import { authGet } from "../Services/http-service";
  import { useFocusEffect } from "@react-navigation/native";
  import * as FileSystem from 'expo-file-system';
  import * as MediaLibrary from "expo-media-library";
const { StorageAccessFramework } = FileSystem;
  
  export default function IndexationListInterne({ navigation }) {
    // to see the DataTable documentation
    // https://callstack.github.io/react-native-paper/data-table.html
  
    const [medcinId, setMedcinId] = useStateIfMounted(null);
    const [token, setToken] = useStateIfMounted(null);
    const [indexation, setIndexation] = useStateIfMounted([]);
  
  
    const actions = [
      {
        text: "Filtrer par Date",
        icon: require("../../assets/filter.png"),
        name: "bt_language",
        position: 1,
      },
      {
        text: "Filtrer par Stade",
        icon: require("../../assets/filter.png"),
        name: "bt_room",
        position: 3,
      },
    ];
    const camera = () => navigation.navigate('Camera');
    const details = () => navigation.navigate('DetailPatient');
  
    useEffect(() => {
      (async () => {
        setMedcinId(await getItem(globalConsts.alias.USER));
        setToken(await getItem(globalConsts.alias.TOKEN));
      })();
    }, []);
  
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
          navigation.replace('IndexationEntryScreen');
          return true;
        };
  
        BackHandler.addEventListener('hardwareBackPress', onBackPress);
  
        return () =>
          BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      } ,[])
    );

    const displayStoreError = () => {
        Alert.alert("Avertissement !", "problème lors de chargement des données", [
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
  
    useEffect(async () => {
      if (medcinId != null && token != null) {
        await fetchData();
        // console.log('data' , indexation);
      }
    }, [medcinId, token]);
  
    
    const fetchData = async () => {

        // console.log('begin ...');

        // await saveItem(globalConsts.alias.INDEXED,null)
        const indexed = await getItem(globalConsts.alias.INDEXED);
        console.log(indexed);

        // const folders = await FileSystem.readDirectoryAsync('file:///storage/emulated/0/Pictures/AppsCollect');
        let folders = await FileSystem.readDirectoryAsync('file:///storage/emulated/0/DCIM');

        // console.log(folders);

        var assets = []

        if(indexed != null && indexed.length != 0) {
          folders = folders.filter(folder => folder.substring(0 , 2) == 'P_' && !indexed.includes(folder));
        } else {
          folders = folders.filter(folder => folder.substring(0 , 2) == 'P_');
        }
        
        // console.log(folders);

        for(let index in folders){

          const foldersIntern = await FileSystem.readDirectoryAsync(
            "file:///storage/emulated/0/DCIM/" + folders[index]
          );

          // console.log(`\t begin ${index} ...`);
          var tmp = {};

          const images = await FileSystem.readDirectoryAsync(
            "file:///storage/emulated/0/DCIM/" +
              folders[index] +
              "/" +
              foldersIntern[0]
          );
          const res = await FileSystem.getInfoAsync(
            "file:///storage/emulated/0/DCIM/" + folders[index]
          );
          tmp.eye = folders[index].slice(-1) == "L" ? "LEFT" : "RIGHT";
          tmp.stade = "NOT_INDEXED";
          tmp.medcinId = medcinId;
          tmp.images = [];
          tmp.id =
            "file:///storage/emulated/0/DCIM/" +
            folders[index] +
            "/" +
            foldersIntern[0];
          // tmp.date_acquisition = new Date(parseInt(asset.creationTime , 10)).toISOString().slice(0, 10);
          tmp.date_acquisition =
            foldersIntern[0].slice(0, 4) +
            "-" +
            foldersIntern[0].slice(4, 6) +
            "-" +
            foldersIntern[0].slice(6, 8);

          for (let imgIndex in images) {
            // if(imgIndex == 0){

            // const asset = await FileSystem.getInfoAsync("file:///storage/emulated/0/DCIM/" + folders[index]+'/'+images[imgIndex])

            // const asset = await MediaLibrary.createAssetAsync("file:///storage/emulated/0/DCIM/" + folders[index]+'/'+images[imgIndex]);
            //  const assetInfo = await MediaLibrary.getAssetInfoAsync("file:///storage/emulated/0/DCIM/" + folders[index]+'/'+images[imgIndex]);
            // console.log(asset);
            // tmp.date_acquisition = new Date(parseInt(asset.creationTime , 10)).toISOString().slice(0, 10);
            // }
            tmp.images.push(
              "file:///storage/emulated/0/DCIM/" +
                folders[index] +
                "/" +
                images[imgIndex]
            );
          }

          assets.push(tmp);

          assets.sort((a, b) => {
            let fa = a.id.split('/').slice(-2,-1).pop().toLowerCase(),
                fb = b.id.split('/').slice(-2,-1).pop().toLowerCase();
        
            if (fa < fb) {
                return -1;
            }
            if (fa > fb) {
                return 1;
            }
            return 0;
        });
          console.log(tmp)
          // console.log(`\t finish ${index} ...\n`);
        }

        // console.log(assets)
        setIndexation(assets);


        console.log('finish ...');

    };
  
  
    return (
      <View
        style={[
          globalStyles.safeArea,
          globalStyles.full,
          styles.container,
          
        ]}
      >
        <Header title="Liste oDocs nunIR" />
        <View style={styles.body}>
  
          <View style={[globalStyles.full, { margin: 10, marginTop: 20 }]}>
            <ScrollView style={[globalStyles.full ]} contentContainerStyle={{ paddingHorizontal : 10 }}>
  
  
            {(() => {
              if (indexation != null) {
                if (indexation.length > 0) {
                  return indexation.map((item, index) => {
                    return (
                      <IndexationCard key={index} data={item} onPress={() => navigation.replace('IndexationDetailsInterne' , {id : item.id})}/>
                    );
                  });
                } else {
                  return (
                    <View style={{ width: "100%" }}>
                      <Text style={{ alignSelf: "center" }}>Pas d'indexation</Text>
                    </View>
                  );
                }
              } else {
                return (
                  <View style={{ width: "100%" }}>
                    <Text style={{ alignSelf: "center" }}>Pas d'indexation</Text>
                  </View>
                );
              }
            })()}
  
  
              {/* <IndexationCard onPress={() => navigation.navigate('IndexationDetails')}/>
              <IndexationCard onPress={() => navigation.navigate('IndexationDetails')}/>
              <IndexationCard onPress={() => navigation.navigate('IndexationDetails')}/>
              <IndexationCard onPress={() => navigation.navigate('IndexationDetails')}/>
              <IndexationCard onPress={() => navigation.navigate('IndexationDetails')}/> */}
            </ScrollView>
          </View>
  
          {/* <FloatingAction
            actions={actions}
            onPressItem={(name) => {
              console.log(`selected button: ${name}`);
            }}
          /> */}
        </View>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      backgroundColor: globalConsts.colors.primaryColor,
    },
    body: {
      paddingTop: 20,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      backgroundColor: globalConsts.colors.helperColor,
      flex: 1,
    },
  })