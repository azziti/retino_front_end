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
  
  export default function IndexationListLocal({ navigation }) {
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
        Alert.alert("Avertissement !", "probl??me lors de chargement des donn??es", [
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

      // saveItem(globalConsts.alias.INDEXATION,null );
      // saveItem(globalConsts.alias.INDEXED,null );


      // console.log('Echantillon/'+medcinId+'/NotIndexedEchantillons');
        const localData = await getItem(globalConsts.alias.INDEXATION).then((res)=>{
            console.log(res);
            setIndexation(res);
            // console.log('data loaded successfully', indexation);
        }).catch((error) => {
            console.log(error);
            displayStoreError();

        });

  
    //   authGet(
    //     token,
    //     globalConsts.links.SPRING_API,
    //     {} ,
    //     // {medcinID : },
    //     // "medcins/" + medcinId + "/patients/" + route.params.id
    //     'Echantillon/'+medcinId+'/NotIndexedEchantillons'
    //   )
    //     .then(async (res) => {
    //       console.log(res.data);
    //       setIndexation(res.data);
    //     })
    //     .catch(async (err) => {
    //       console.log(err);
    //       // setLoaderVisible(false)
    //       // saveItem(globalConsts.alias.LOGIN, true);
    //       // dispatch(setLogin(await getItem(globalConsts.alias.LOGIN)))
    //     });

    };
  
  
    return (
      <View
        style={[
          globalStyles.safeArea,
          globalStyles.full,
          styles.container,
          
        ]}
      >
        <Header title="Liste locale" />
        <View style={styles.body}>
  
          <View style={[globalStyles.full, { margin: 10, marginTop: 20 }]}>
            <ScrollView style={[globalStyles.full ]} contentContainerStyle={{ paddingHorizontal : 10 }}>
  
  
            {(() => {
              if (indexation != null) {
                if (indexation.length > 0) {
                  return indexation.map((item, index) => {
                    return (
                      <IndexationCard key={index} data={item} onPress={() => navigation.replace('IndexationDetailsLocal' , {id : item.id})}/>
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