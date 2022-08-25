import {
  StyleSheet,
  View,
  ScrollView,
  Text,
} from "react-native";
import React, { useEffect, useState } from "react";
import { globalStyles } from "../Globals/global-styles";
import { globalConsts } from "../Globals/global-const";
import Header from "../Components/header";
import CustomSearchBar from "../Components/search-bar";
import { FloatingAction } from "react-native-floating-action";
import PatientCard from "../Components/patient-card";
import { useDispatch, useSelector } from "react-redux";
import { setImages } from "../Reducers/images-reducer";
import { getItem } from "../Services/store-service";
import { authHeader, authPost } from "../Services/http-service";
import { useStateIfMounted } from "use-state-if-mounted";

export default function ExistingPatients({ navigation }) {

  const dispatch = useDispatch();

  const [ medcinId , setMedcinId ] = useStateIfMounted(null)
  const [ patients , setPatients ] = useState([]);
  const [ token , setToken ] = useStateIfMounted(null);
     

  useEffect(() => {
    (async ()=>{
      setMedcinId(await getItem(globalConsts.alias.USER));
      setToken(await getItem(globalConsts.alias.TOKEN));
    })()
  })

  // to see the DataTable documentation
  // https://callstack.github.io/react-native-paper/data-table.html
  const image = { uri: "assets/retino.jpg" };

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
  const onBackPressed = () => {
    navigation.navigate('EntryPage')
  }
  const goToNewContole = (id , nom , prenom) => {
    dispatch(setImages([]));
    navigation.replace('Camera' , { id , nom , prenom });
  }

  const goToPatientDetails = (id) => {
    navigation.replace('DetailPatient' , { id });
  }
  const camera = () => navigation.navigate('Camera');
  const details = () => navigation.navigate('DetailPatient')

  function fetchPatient(data )  {
    // console.log(token);
    authPost(token, globalConsts.links.SPRING_API , { nom_prenom_cin : data } , 'medcins/'+medcinId+'/patients').then(async (res) =>{
      console.log(res.data);
      setPatients(res.data)

    }).catch( async (err) => {
      console.log(err)
      // saveItem(globalConsts.alias.LOGIN, true);
      // dispatch(setLogin(await getItem(globalConsts.alias.LOGIN)))

  });
  }

  return (
    <View
      style={[
        globalStyles.safeArea,
        globalStyles.full,
        styles.container,
        
      ]}
    >
      <Header title="Liste des patients" onBackPress={onBackPressed} />
      <View style={styles.body}>
        <CustomSearchBar onChange={fetchPatient}/>

        <View style={[globalStyles.full, { margin: 10, marginTop: 20 }]}>
          <ScrollView style={[globalStyles.full ]} contentContainerStyle={{ paddingHorizontal : 10 }}>
          { patients.length > 0 && 
            
              patients.map((item , index)=> {
                return (
                  <PatientCard key={index} patient={goToPatientDetails} camera={goToNewContole} details={item} />
                );
              })

          }
          {
            patients.length == 0 && 
            (
              <View style={{ width : '100%' }}>
                <Text style={{ alignSelf : 'center' }}>Pas de resultat</Text>
              </View>
            )
          }
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