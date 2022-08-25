import { View, Text, StyleSheet } from "react-native";
import React , { useState } from "react";
import SearchBar from "react-native-platform-searchbar";

export default function CustomSearchBar({ placeholder , theme , cancelText , onChange }) {
  const [ value , setValue ] = useState('');
  // the documentation link for the searchBar library
  // https://github.com/bviebahn/react-native-platform-searchbar#readme
  const handleChange = (data) => {
    setValue(data);
    onChange(data);
  }

  return (
    <View style={styles.searchBarContainer}>
      <SearchBar
        
        value={value}
        onChangeText={handleChange}
        placeholder={placeholder ? placeholder : "Nom ou CIN" }
        theme={theme ? theme : 'light' }
        platform = { Platform.OS === 'android' ? 'android' : 'ios' }
        inputStyle={styles.searchBar}
        cancelText = { cancelText ? cancelText : 'Annuler' } 
        onClear={() => setValue('')}
      ></SearchBar>
    </View>
  );
}

const styles = StyleSheet.create({
  searchBar : {
    borderRadius : 20 , 
    color : 'black'
  },
  searchBarContainer : {
    width : '100%',
    paddingHorizontal : 20
  }
});
