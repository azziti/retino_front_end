import {
    StyleSheet,
    View,
    ScrollView,
    Text,
    BackHandler,
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
  import { getItem } from "../Services/store-service";
  import { authGet } from "../Services/http-service";
  import { useFocusEffect } from "@react-navigation/native";
  
  // ExistingPatients
  export default function IndexationListIndexed({ navigation }) {
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
  
    useEffect(() => {
      if (medcinId != null && token != null) {
        fetchData();
      }
    }, [medcinId, token]);
  
  
    const fetchData = async () => {
      // setLoaderVisible(true)
      console.log('Echantillon/'+medcinId+'/AllIndexedEchantillons');
  
      authGet(
        token,
        globalConsts.links.SPRING_API,
        {} ,
        // {medcinID : },
        // "medcins/" + medcinId + "/patients/" + route.params.id
        'Echantillon/'+medcinId+'/AllIndexedEchantillons'
      )
        .then(async (res) => {
          console.log(res.data);
          setIndexation(res.data);
        })
        .catch(async (err) => {
          console.log(err);
          // setLoaderVisible(false)
          // saveItem(globalConsts.alias.LOGIN, true);
          // dispatch(setLogin(await getItem(globalConsts.alias.LOGIN)))
        });
    };
  
  
    return (
      <View
        style={[
          globalStyles.safeArea,
          globalStyles.full,
          styles.container,
          
        ]}
      >
        <Header title="Liste indexé" />
        <View style={styles.body}>
  
          <View style={[globalStyles.full, { margin: 10, marginTop: 20 }]}>
            <ScrollView style={[globalStyles.full ]} contentContainerStyle={{ paddingHorizontal : 10 }}>
  
  
            {(() => {
              if (indexation != null) {
                if (indexation.length > 0) {
                  return indexation.map((item, index) => {
                    return (
                      <IndexationCard key={index} data={item} onPress={() => navigation.replace('IndexationDetailsIndexed' , {id : item.id})}/>
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