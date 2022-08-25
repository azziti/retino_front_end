import React, {useState} from 'react';
import {Text, StyleSheet, View, TextInput, Button, Pressable} from 'react-native';
import DateInputCard from '../Components/date-input-component';
import InputCard from '../Components/input-card';
import LoaderModal from '../Components/loader';
import { globalConsts } from '../Globals/global-const';
import { deleteItem, getItem, saveItem } from '../Services/store-service';

export default function TestScreen() {
  const [value, setValue] = useState('');
  const [storeValue, setStreValue] = useState('');

  const handleTextChange = (value) => {
    setValue(value)    
  }
  const handleSubmit = async () => {
      console.log('added ',value)
      saveItem(globalConsts.alias.LAUNCHED , value)
      console.log('directly after the add ' , await getItem(globalConsts.alias.LAUNCHED))

  }
  const deleteValue = () => {
      deleteItem(globalConsts.alias.LAUNCHED).then(()=> console.log('deleted')).catch(()=> console.log('delete probleme'))

}
  const  retrieveValue = async () => {
    // getItem('item').then(data => console.log('retrieve ',data)).catch((error)=> console.log(error))
    // console.log(data)
    const value1 = await getItem(globalConsts.alias.LAUNCHED).then(data => { return data}).catch((error)=> error)
    // value1.then(value => console.log(value))
    console.log(value1)

}

  return (
    // <View style ={{ flex : 1 , margin : 20 , marginVertical : 100 }} >
    //   <Text > Demo Form </Text>
    //   <View>
    //     <TextInput 
    //         style={{ borderColor : '#000' , borderWidth : 3 }}
    //         onChangeText={handleTextChange}
    //         placeholder="Email"  />
    //     <Text>
    //       Selected: {value}
    //     </Text>
    //     <Pressable style={{ marginVertical:5 , widht : '100%' , height : 50 , backgroundColor : 'yellow' , alignItems : 'center' , justifyContent : 'center' }} onPress={handleSubmit}>
    //         <Text>Submit</Text>
    //     </Pressable>
    //     <Pressable style={{ marginVertical:5 , widht : '100%' , height : 50 , backgroundColor : 'yellow' , alignItems : 'center' , justifyContent : 'center' }} onPress={retrieveValue}>
    //         <Text>Retrieve</Text>
    //     </Pressable>
    //     <Pressable style={{ marginVertical:5 , widht : '100%' , height : 50 , backgroundColor : 'yellow' , alignItems : 'center' , justifyContent : 'center' }} onPress={deleteValue}>
    //         <Text>Delete</Text>
    //     </Pressable>
    //     <Text>
    //       Selected: {storeValue}
    //     </Text>
    //   </View>
    // </View>
    <LoaderModal
    visible={true}
    // setVisible={setIsOptionsModalVisible}
    // onNewPatient={switchModals}
    // onExistingPatient={() => {
    //   setIsOptionsModalVisible(false);
    //   navigation.navigate("ExistingPatients");
    // }}
  />
  );
};
const styles = StyleSheet.create({
  //Check project repo for styles
});

