import React, { useEffect, useRef } from "react";
import {
  View,
  Animated,
  Image,
  ScrollView,
  Text,
  StyleSheet,
  StatusBar,
  Pressable,
} from "react-native";
import { globalConsts } from "../Globals/global-const";
import { globalStyles } from "../Globals/global-styles";
import Ionicons from "react-native-vector-icons/Ionicons";
import ConsultationCard from "../Components/consultation-card";
import { useDispatch } from "react-redux";
import { setImages } from "../Reducers/images-reducer";
import { authGet } from "../Services/http-service";
import { useStateIfMounted } from "use-state-if-mounted";
import { getItem } from "../Services/store-service";

const H_MAX_HEIGHT = 250;
const H_MIN_HEIGHT = 65;
const H_SCROLL_DISTANCE = H_MAX_HEIGHT - H_MIN_HEIGHT;

export default PatientDetails = ({ route, navigation }) => {
  const [medcinId, setMedcinId] = useStateIfMounted(null);
  const [patient, setPatient] = useStateIfMounted([]);
  const [token, setToken] = useStateIfMounted(null);

  useEffect(() => {
    (async () => {
      setMedcinId(await getItem(globalConsts.alias.USER));
      setToken(await getItem(globalConsts.alias.TOKEN));
    })();
  }, []);

  useEffect(() => {
    if (medcinId && token) {
      fetchData();
    }
  }, [medcinId, token]);

  const fetchData = async () => {
    // setLoaderVisible(true)
    console.log("medcins/" + medcinId + "/patients/" + route.params.id);

    authGet(
      token,
      globalConsts.links.SPRING_API,
      {},
      "medcins/" + medcinId + "/patients/" + route.params.id
      // "medcins/2/patients/5"
    )
      .then(async (res) => {
        console.log(res.data);
        setPatient(res.data);
      })
      .catch(async (err) => {
        console.log(err);
        // setLoaderVisible(false)
        // saveItem(globalConsts.alias.LOGIN, true);
        // dispatch(setLogin(await getItem(globalConsts.alias.LOGIN)))
      });
  };

  const dispatch = useDispatch();

  const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);
  const camera = () => navigation.navigate("Camera");
  const details = () => navigation.navigate("ControleDetails");
  const scrollOffsetY = useRef(new Animated.Value(0)).current;

  const headerScrollHeight = scrollOffsetY.interpolate({
    inputRange: [0, H_SCROLL_DISTANCE],
    outputRange: [H_MAX_HEIGHT, H_MIN_HEIGHT],
    extrapolate: "clamp",
  });

  const headerScrollWidth = scrollOffsetY.interpolate({
    inputRange: [0, H_SCROLL_DISTANCE],
    outputRange: ["100%", "20%"],
    extrapolate: "clamp",
  });

  const headerScrollColor = scrollOffsetY.interpolate({
    inputRange: [0, H_SCROLL_DISTANCE],
    outputRange: [
      globalConsts.colors.helperColor,
      globalConsts.colors.primaryColor,
    ],
    extrapolate: "clamp",
  });

  const arrowScrollColor = scrollOffsetY.interpolate({
    inputRange: [0, H_SCROLL_DISTANCE],
    outputRange: [globalConsts.colors.primaryColor, "#fff"],
    extrapolate: "clamp",
  });

  const paddingScrollColor = scrollOffsetY.interpolate({
    inputRange: [0, H_SCROLL_DISTANCE],
    outputRange: [20, 0],
    extrapolate: "clamp",
  });

  const goToNewContole = (id , nom , prenom) => {
    dispatch(setImages([]));
    navigation.replace("Camera", { id , nom , prenom  });
  };

  const goToControlDetails = (id) => {
    navigation.navigate("ControleDetails", { idPatient : route.params.id , idControl : id , flag : true  });
  };

  const stades = {
    "PAS_DE_RD" :'ABS' , 
    "RDNP_MINIME" :'1' , 
    "RDNP_MODEREE" :'2' ,
    "RDNP_SEVERE" : '3', 
    "RD_TRAITEE_NON_ACTIVE" : '4' ,
  };
  
  return (
    <View style={{ flex: 1, backgroundColor: globalConsts.colors.helperColor }}>
      <ScrollView
        contentContainerStyle={{ margin: 10, marginTop: 0, paddingBottom: 40 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }],
          { useNativeDriver: false }
        )}

        // scrollEventThrottle={16}
      >
        <View style={{ paddingTop: H_MAX_HEIGHT }}>
          <View
            style={[
              styles.card,
              { backgroundColor: globalConsts.colors.helperColor },
            ]}
          >
            <View
              style={[
                {
                  padding: 20,
                },
              ]}
            >
              <View style={[globalStyles.full, { flexDirection: "row" }]}>
                <View style={[{ flex: 1, marginStart: 20 }]}>
                  <Text style={[styles.header]}>
                    {" "}
                    {(patient.prenom == null ? "Inkonnu" : patient.prenom) +
                      " " +
                      (patient.nom == null ? "Inkonnu" : patient.nom)}{" "}
                  </Text>
                  <Text style={[styles.text]}>
                    Age :{" "}
                    <Text style={[styles.blackText]}>
                      {patient.age != null ? patient.age : "en cours..."}
                    </Text>
                  </Text>
                  <Text style={[styles.text]}>
                    CIN :{" "}
                    <Text style={[styles.blackText]}>
                      {patient.cin != null ? patient.cin : "en cours..."}
                    </Text>
                  </Text>
                  {/* <Text style={[styles.text]}>
                    Stade : <Text style={[styles.blackText]}>5</Text>
                  </Text> */}
                </View>
              </View>
              <View
                style={[
                  {
                    paddingTop: 10,
                    flexDirection: "row",
                    justifyContent: "flex-start",
                  },
                ]}
              >
                <Ionicons
                  name="time-outline"
                  size={16}
                  color={globalConsts.colors.greyText}
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.text]}>Derniere consultaion : </Text>
                <Text style={[styles.blackText]}>
                  {patient.derniere_consultation == null
                    ? "pas de consultation faite"
                    : patient.derniere_consultation}
                </Text>
              </View>
            </View>
          </View>

          {(() => {
            if (patient.controlsDto != null) {
              if (patient.controlsDto.length > 0) {
                return patient.controlsDto.map((item, index) => {
                  return (
                    <ConsultationCard
                      key={index}
                      camera={() => goToControlDetails(item.id)}
                      details={item}
                    />
                  );
                });
              } else {
                return (
                  <View style={{ width: "100%" }}>
                    <Text style={{ alignSelf: "center" }}>Pas de controle</Text>
                  </View>
                );
              }
            } else {
              return (
                <View style={{ width: "100%" }}>
                  <Text style={{ alignSelf: "center" }}>Pas de controle</Text>
                </View>
              );
            }
          })()}

          {/* <ConsultationCard camera={camera} details={details} /> */}
          {/* <ConsultationCard camera={camera} details={details} />
            <ConsultationCard camera={camera} details={details} />
            <ConsultationCard camera={camera} details={details} />
            <ConsultationCard camera={camera} details={details} /> */}
        </View>
      </ScrollView>

      <Animated.View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          // top : 0 ,
          top: StatusBar.currentHeight,
          height: headerScrollHeight,
          width: "100%",
          overflow: "hidden",
          zIndex: 2,
          padding: 10,
          paddingTop: 10,
          backgroundColor: headerScrollColor,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View style={{ width: 50 }}>
          <Pressable style={{ flex: 1 }} onPress={() => navigation.goBack()}>
            <AnimatedIcon
              name="arrow-back-outline"
              size={22}
              style={{ margin: 9, color: arrowScrollColor }}
            />
          </Pressable>
        </View>
        <Animated.View
          style={{
            flex: 1,
            alignItems: "flex-start",
            paddingTop: paddingScrollColor,
          }}
        >
          <Animated.View
            style={{
              height: "100%",
              width: headerScrollWidth,
            }}
          >
            <Image
              source={require("../../assets/profile.png")}
              style={{ flex: 1, width: "100%" }}
              resizeMode="contain"
            />
          </Animated.View>
        </Animated.View>
        <View style={{ width: 50 }}>
          <Pressable onPress={() => goToNewContole(route.params.id , patient.nom , patient.prenom )}>
            <AnimatedIcon
              name="add-outline"
              size={24}
              style={{ margin: 9, color: arrowScrollColor }}
            />
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 5,
    borderRadius: 15,
    backgroundColor: globalConsts.colors.secondaryColor,
    // borderColor: globalConsts.colors.greyText,
    // borderWidth: 0.4,
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
    fontWeight: "bold",
    marginStart: 5,
  },
  blackText: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#000",
  },
  button: {
    color: globalConsts.colors.primaryColor,
    fontWeight: "bold",
    fontSize: 15,
  },
});
