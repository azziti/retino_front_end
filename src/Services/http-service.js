import axios from "axios";
import { useSelector } from "react-redux";
import { globalConsts } from "../Globals/global-const";
import { deleteItem, getItem, saveItem } from "./store-service";





const post = (api =globalConsts.links.API_URL , data = null, location) => {
  
  return axios.post(api + location , data , { headers : {
    "Content-Type" : "application/json" , Accept: "application/json" ,
  }});

};

const get = (api =globalConsts.links.API_URL , data = null, location) => {
  return axios.get(api + location , data , { headers : {
    "Content-Type" : "application/json" , Accept: "application/json" ,
  }});
};

const authGet = (token = null , api = globalConsts.links.API_URL ,  data = null, location) => {
  console.log(token);
  return axios.get(api + location  , {
    headers: {
      Authorization : token,
      "Content-Type" : "application/json",
      // Accept: 'application/json',
    }
  });
};

const authPost = (token = null , api = globalConsts.links.API_URL ,  data = null, location) => {
  console.log(token)
  console.log(data);
  console.log(location)
  return axios.post(api + location , data ,
    {
    headers: {
            Authorization : token,
            "Content-Type" : "application/json",
            // Accept: 'application/json',
          }
  });
};

const fileAuthPost = (token = null , api = globalConsts.links.API_URL , data = null, location) => {
  console.log(token , location)
  return axios.post(api + location, data, {
    headers: {
      "Content-Type": "multipart/form-data",
      Accept: "*/*",
      Authorization : token != null ? token : '' ,
    },
  });
};

const authHeader =  () => {

  
  // let token ;
  // (async()=>{
  //   token = await getItem(globalConsts.alias.TOKEN);
  // })();
  // console.log(token)
  // return token
  // if (token) {
  //     return {
  //       Authorization : token,
  //       "Content-Type" : "application/json",
  //       // Accept: 'application/json',
  //     };

  // } else {
  //   return {};
  // }
  console.log('naddi')

};


export { get, post, authGet, authPost , fileAuthPost , authHeader };
