import { View, Text, TouchableOpacity, StyleSheet, Image  } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons' ;
import React from "react";
import {
  Container,
  Content,
  Email,
  FooterContent,
  FooterText,
  ImageContainer,
  Name,
} from "../Screens/styles";
import { globalConsts } from "../Globals/global-const";
import { globalStyles } from "../Globals/global-styles";

export default function PatientCard({details , camera , patient}) {

  const stades = {
    "PAS_DE_RD" :'ABS' , 
    "RDNP_MINIME" :'1' , 
    "RDNP_MODEREE" :'2' ,
    "RDNP_SEVERE" : '3', 
    "RD_TRAITEE_NON_ACTIVE" : '4' ,
  };

  return (
    <TouchableOpacity
      style={[styles.card]}
      // onPress={() => navigate("DetailsPatient")}
    >
      <View
        style={[
          {
            flexDirection: "column",
            padding: 20,
            borderBottomColor: globalConsts.colors.greyText,
            borderBottomWidth: 0.4,
          },
        ]}
      >
        <View style={[globalStyles.full , {flexDirection : 'row'}]}>
          <View>
            <Image
              style={[styles.image]}
              source={require('../../assets/profile.png')}
            />
          </View>
          <View style={[{ flex: 1, marginStart: 20 }]}>
            <Text style={[styles.header]}> { details.prenom + ' ' + details.nom } </Text>
            <Text style={[styles.text]}>
              Age : <Text style={[styles.blackText]}>{calculateAge(details.date_naissance)}</Text>
            </Text>
            <Text style={[styles.text]}>
              CIN : <Text style={[styles.blackText]}>{details.cin}</Text>
            </Text>
            <Text style={[styles.text]}>
              Stade : <Text style={[styles.blackText]}>{"OD : " + (details.stade_od == null ? "ND" : stades[details.stade_od] ) + '  ' + "OG : " + ( details.stade_og == null ? "ND" : stades[details.stade_og] ) }</Text>
            </Text>
          </View>
        </View>
        <View style={[{ paddingTop : 10 , flexDirection :'row' , justifyContent : 'flex-start' }]}>
            <Ionicons name="time-outline" size={16} color={globalConsts.colors.greyText} style={{ marginRight : 6 }} />
            <Text style={[styles.text]}>Derniere consultaion : </Text>
            <Text style={[styles.blackText]}>{details.derniere_consultation == null ? "pas de consultation faite" : details.derniere_consultation }</Text>
        </View>
      </View>
      <View
        style={[
          { flexDirection: "row", paddingVertical: 10, paddingHorizontal: 20 ,  justifyContent : 'space-between' },
        ]}
      >
        <View style={[{}]}>
            <TouchableOpacity onPress={() => patient(details.id)}>
                <Ionicons  name="person-outline" size={22} color={globalConsts.colors.primaryColor} style={{ marginRight : 6 }} />
            </TouchableOpacity>
        </View>
        <View>
            <TouchableOpacity style={[{ flexDirection : 'row' , alignItems : 'center' }]} onPress={() => camera(details.id , details.nom , details.prenom)}>
                <Text style={[styles.button]}>Continue</Text>
                <Ionicons name="arrow-forward-outline" size={18} color={globalConsts.colors.primaryColor} style={{ marginStart : 6 ,  }} />
            </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function calculateAge(date) { // birthday is a date
  const data = date.split('-')
  const birthday = new Date(data[0] , data[1] , data[2])
  var ageDifMs = Date.now() - birthday.getTime();
  var ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

const styles = StyleSheet.create({
  card: {
    marginVertical : 5 , 
    borderRadius: 15,
    backgroundColor: globalConsts.colors.secondaryColor,
    borderColor: globalConsts.colors.greyText,
    borderWidth: 0.4,
  },
  image: {
    width: 80,
    height: 80,
  },
  header: {
    fontSize: 19,
    fontWeight: "bold",
    marginBottom: 5,
  },
  text: {
    fontSize: 12,
    color: globalConsts.colors.greyText,
    fontWeight : 'bold',
    marginStart: 5,
  },
  blackText: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#000",
  },
  button : {
      color : globalConsts.colors.primaryColor ,
      fontWeight : 'bold' ,
      fontSize : 15

  }
});
