import React from "react";
import { View, Text ,Image } from 'react-native'
import InputCard from "./input-card";

export default function Logo({ name }) {

  const path = '../../assets/' + name;
  // const image = require(path);
  const images = {
    logo :  require('../../assets/eye-scan.png') ,
    signup : require('../../assets/login.png') 
  }; 

  return (
    <View style={{ alignSelf : 'center' }}>
      <Image
        source={images[name]}
        style={{ width: 90, height: 90 }}
      />
    </View>
  );
}
