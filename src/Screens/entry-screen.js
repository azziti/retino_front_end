import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { globalStyles } from "../Globals/global-styles";
import { globalConsts } from "../Globals/global-const";
import AddPatientModal from "../Components/add-patient-modal";
import OptionsModal from "../Components/options-modal";
import { useDispatch, useSelector } from "react-redux";
import { setLogin } from "../Reducers/authentication-reducer";
import { getItem, saveItem } from "../Services/store-service";
import { authPost, post } from "../Services/http-service";
import { useStateIfMounted } from "use-state-if-mounted";
import { setImages } from "../Reducers/images-reducer";
import LoaderModal from "../Components/loader";

export default function EntryScreen({ navigation }) {
  const dispatch = useDispatch();
  const reduxLogin = useSelector((state) => {
    return state.login.logged;
  });

  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  const [isOptionsModalVisible, setIsOptionsModalVisible] = useState(false);
  const [medcinId, setMedcinId] = useStateIfMounted(null);
  const [token, setToken] = useStateIfMounted(null);
  const openPatientFormModal = () => setIsFormModalVisible(true);
  const openOptionsModal = () => setIsOptionsModalVisible(true);
  const [loaderVisible, setLoaderVisible] = useState(false);

  const switchModals = () => {
    setIsOptionsModalVisible(false);
    setIsFormModalVisible(true);
  };
  const displayduplication = () => {
    Alert.alert(
      "Avertissement !",
      "Ce patient déjà enregistré , Consulter la liste des patients enregistrés",
      [
        {
          text: "Ok",
          onPress: () => {
            null;
          },
          // style: "cancel"
        },
        // { text: "Annuler", onPress:() => clearAndGoBack() }
      ]
    );
  };

  useEffect(() => {
    (async () => {
      setMedcinId(await getItem(globalConsts.alias.USER));
      setToken(await getItem(globalConsts.alias.TOKEN));
    })();
  }, []);

  const logout = async () => {
    saveItem(globalConsts.alias.LOGIN, false);
    dispatch(setLogin(await getItem(globalConsts.alias.LOGIN)));
  };

  const submitData = (data) => {
    data.date_naissance = new Date(data.year, data.month, data.day);
    // data.medcin_id = 1 ;

    const temp = { ...data };
    delete temp.year;
    delete temp.month;
    delete temp.day;
    temp.est_diabetique = temp.est_diabetique == "oui" ? true : false;
    setLoaderVisible(true);
    authPost(
      token,
      globalConsts.links.SPRING_API,
      temp,
      "medcins/" + medcinId + "/createPatient"
    )
      .then((res) => {
        console.log(res.data);
        if (res.data == "Le patient est déjà existé!") {
          setLoaderVisible(false);
          displayduplication();
        } else {
          setLoaderVisible(false);
          goToCameraScreen(res.data.id, res.data.nom, res.data.prenom);
        }
      })
      .catch((error) => {
        if (error.response.status == 417) {
          console.log("patient already existe");
        } else if (error.response.status == 400) {
          console.log("bad request");
        } else if (error.response.status == 405) {
          console.log("methode not allowed");
        } else if (error.response.status == 403) {
          console.log("acces interdit");
        } else {
          console.log("erreur interne de serveur");
        }
        setLoaderVisible(false);
        displayError();
      });
  };

  const goToCameraScreen = (id, nom, prenom) => {
    dispatch(setImages([]));
    navigation.replace("Camera", { id, nom, prenom });
  };

  const displayError = () => {
    Alert.alert("Avertisement !", "probleme de connexion", [
      {
        text: "Ok",
        onPress: () => {
          null;
        },
        // style: "cancel"
      },
      // { text: "Annuler", onPress:() => clearAndGoBack() }
    ]);
  };

  return (
    <View
      style={[
        globalStyles.container,
        globalStyles.safeArea,
        { backgroundColor: globalConsts.colors.secondaryColor },
      ]}
    >
      <LoaderModal visible={loaderVisible} />
      <View
        style={[
          {
            width: "80%",
            backgroundColor: "transparent",
            flexDirection: "column",
            alignItems : 'center' ,
            justifyContent : 'center',
            paddingVertical: 20,
          },
          globalStyles.container,
        ]}
      >
        <View
          style={[
            {
              flex: 1,
              justifyContent: "center",
              marginBottom: 10,
              backgroundColor: "transparent",
            },
          ]}
        >
          <TouchableOpacity
            style={[
              {
                height: 180,
                width: 200,
                backgroundColor: "#14a8df",
                borderRadius: 30,
                elevation: 15,
                alignItems: "center",
                justifyContent: "flex-end",
                paddingBottom: 15,
              },
            ]}
            onPress={openOptionsModal}
          >
            <Image
              style={{ height : 75 , width : 75 }}
              source={require("../../assets/logo/shape.png")}
              resizeMode="center"
            />
            <View
              style={{
                marginTop: 20,
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={[
                  {
                    borderBottomEndRadius: 30,
                    borderBottomStartRadius: 30,
                    borderRadius: 20,
                    backgroundColor: "#fff",
                    width: "90%",
                    minHeight: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    elevation: 3,
                  },
                ]}
              >
                <Text
                  style={{ color: "#df5414", fontWeight: "bold", fontSize: 17 }}
                >
                  Nouveau controle
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <View
          style={[
            {
              flex: 1,
              justifyContent: "center",
              marginTop: 10,
              backgroundColor: "transparent",
            },
          ]}
        >
          <TouchableOpacity
            style={[
              {
                height: 180,
                width: 200,
                backgroundColor: "#14a8df",
                borderRadius: 30,
                elevation: 15,
                alignItems: "center",
                justifyContent: "flex-end",
                paddingBottom: 15,
              },
            ]}
            onPress={() => navigation.navigate("Indexation")}
          >
            <Image
              style={{ height : 70 , width : 70 }}
              source={require("../../assets/logo/analytics.png")}
              resizeMode="center"
            />
            <View
              style={{
                marginTop: 20,
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={[
                  {
                    borderBottomEndRadius: 30,
                    borderBottomStartRadius: 30,
                    borderRadius: 20,
                    backgroundColor: "#fff",
                    width: "90%",
                    minHeight: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    elevation: 3,
                  },
                ]}
              >
                <Text
                  style={{ color: "#df5414", fontWeight: "bold", fontSize: 17 }}
                >
                  Indexation
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <View
          style={[
            {
              flex: 1,
              justifyContent: "center",
              marginTop: 10,
              backgroundColor: "transparent",
            },
          ]}
        >
          <TouchableOpacity
            style={[
              {
                height: 180,
                width: 200,
                backgroundColor: "#14a8df",
                borderRadius: 30,
                elevation: 15,
                alignItems: "center",
                justifyContent: "flex-end",
                paddingBottom: 15,
              },
            ]}
            onPress={logout}
          >
            <Image
              style={{ height : 60 , width : 60 }}
              source={require("../../assets/logo/exit.png")}
              resizeMode="center"
            />
            <View
              style={{
                marginTop: 20,
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={[
                  {
                    borderBottomEndRadius: 30,
                    borderBottomStartRadius: 30,
                    borderRadius: 20,
                    backgroundColor: "#fff",
                    width: "90%",
                    minHeight: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    elevation: 3,
                  },
                ]}
              >
                <Text
                  style={{ color: "#df5414", fontWeight: "bold", fontSize: 17 }}
                >
                  Deconnexion
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <AddPatientModal
        submit={submitData}
        visible={isFormModalVisible}
        setVisible={setIsFormModalVisible}
      />
      <OptionsModal
        visible={isOptionsModalVisible}
        setVisible={setIsOptionsModalVisible}
        onNewPatient={switchModals}
        onExistingPatient={() => {
          setIsOptionsModalVisible(false);
          navigation.navigate("ExistingPatients");
        }}
      />
    </View>
  );
}
