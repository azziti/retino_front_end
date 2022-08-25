import { View, Text, TouchableOpacity, StyleSheet, Image  } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons' ;
import React from "react";
import { globalConsts } from "../Globals/global-const";
import { globalStyles } from "../Globals/global-styles";

export default function ConsultationCard({details , camera}) {

  const stades = {
    "PAS_DE_RD" :'ABS' , 
    "RDNP_MINIME" :'1' , 
    "RDNP_MODEREE" :'2' ,
    "RDNP_SEVERE" : '3', 
    "RD_TRAITEE_NON_ACTIVE" : '4' ,
  };

  return (
    <TouchableOpacity
      style={[styles.card] }
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
              source={require('../../assets/medical-box.png')}
            />
          </View>
          <View style={[{ flex: 1, marginStart: 20 }]}>
              <View style={{ flexDirection : 'row' , alignItems : 'center' , paddingLeft : 6  }}>
              <Ionicons name="time-outline" size={16} color='#000' style={{ marginBottom : 4 }} />
              <Text style={[styles.header]}> {details.created_at} </Text>
              </View>
            <Text style={[styles.text]}>
              Medcine : <Text style={[styles.blackText]}>{(details.medcin.prenom == null ? "Inkonnu" : details.medcin.prenom) +
                      " " +
                      (details.medcin.nom == null ? "Inkonnu" : details.medcin.nom)}</Text>
            </Text>
            <Text style={[styles.text]}>
              OD Stade : <Text style={[styles.blackText]}>{(details.stade_od == null ? "ND" : stades[details.stade_od] ) }</Text>
            </Text>
            <Text style={[styles.text]}>
              OG Stade : <Text style={[styles.blackText]}>{(details.stade_og == null ? "ND" : stades[details.stade_og] ) }</Text>
            </Text>
          </View>
        </View>
      </View>
      <View
        style={[
          { flexDirection: "row", paddingVertical: 10, paddingHorizontal: 20 ,  justifyContent : 'flex-end' },
        ]}
      >
        <View>
            <TouchableOpacity style={[{ flexDirection : 'row' , alignItems : 'center' }]} onPress={camera}>
                <Text style={[styles.button]}>Voir Details</Text>
                <Ionicons name="arrow-forward-outline" size={18} color={globalConsts.colors.primaryColor} style={{ marginStart : 6 ,  }} />
            </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
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
    fontSize: 16,
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
