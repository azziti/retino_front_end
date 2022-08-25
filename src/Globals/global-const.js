import React from "react";

export const globalConsts = {
  colors: {
    // primaryColor: "#14a5fe",
    primaryColor: "#1f65ff",
    secondaryColor: "#fff",
    helperColor: "#f2f2f2",
    helperGray : '#CBD9E7',
    greyText : '#888'
  },
  links : {
    // API_URL : "http://localhost:8080/"
    // API_URL : "http://192.168.1.111:8080/" ,
    SPRING_API : "http://192.168.43.240:8080/" ,
    // SPRING_API : "http://192.168.43.235:8080/" ,
    // SPRING_API : "https://561b-196-89-135-27.eu.ngrok.io/" ,
    FAST_API : "http://192.168.43.240:8000/",

  } ,
  tokens : {

  } ,
  alias : {
    LAUNCHED : 'launched' ,
    TOKEN : 'token' ,
    USER : 'user' ,
    LOGIN : 'users/login' ,
    REGISTER : 'users/createMedcin' ,
    NEW_PATIENT : 'patients/createPatient' ,
    INDEXATION : 'indexations',
    INDEXED : 'indexed' ,
    
  } ,

};
