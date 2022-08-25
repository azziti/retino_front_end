import AsyncStorage from "@react-native-async-storage/async-storage";

const saveItem = async (key, value) => {
    try {
      const jsonData = JSON.stringify(value);
      return await AsyncStorage.setItem(key, jsonData);
    } catch (error) {
      return new Promise.reject(error)
    }
}

const getItem = async (key) => {
    try {
        const jsonValue = await AsyncStorage.getItem(key)
        return jsonValue != null ? JSON.parse(jsonValue) : null;

    } catch (error) {
      // return new Promise.reject(error)
      return null ;
    }
}

const deleteItem = async (key) => {
    try {
      return await AsyncStorage.removeItem(key)
    } catch (error) {
      return new Promise.reject(error)
    }
}

const saveToken = (value) => {
  localStorage.setItem("key", value );
} 
const getToken = () => {
  return localStorage.getItem("key");
} 

export { saveItem , getItem , deleteItem } ;     


