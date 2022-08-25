import { get, post } from "./http-service";
import { deleteItem, getItem, saveItem } from "./store-service";
 

const login = (data , url , key) => {
    post(data , url)
      .then((response) => {
        return response.data;
      }) .then(data => {
        saveItem( key , data.token  )
     })
     .catch(error => {
        console.log(error)
     });
};


const register = (data , url , key) => {
    post(data , url)
      .then((response) => {
        return response.data;
      }) .then(data => {
        saveItem( key , data.token  )
     })
     .catch(error => {
        console.log(error)
     });
};

const logout = (url , key) => {
    post(url = url)
      .then((response) => {
        return response.data;
      }) .then(data => {
        deleteItem(key)
     })
     .catch(error => {
        console.log(error)
     });
};


export { authHeader };
