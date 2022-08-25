import { View, Text, TouchableOpacity, Image, BackHandler } from "react-native";
import React , { useState } from "react";
import { globalStyles } from "../Globals/global-styles";
import { globalConsts } from "../Globals/global-const";
import { useFocusEffect } from "@react-navigation/native";
import IndexationOptionsModal from "../Components/indexation-options-modal";



export default function IndexationEntryScreen({navigation}) {

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // Alert.alert("Avertisement !", "Est vous etes sure que vous voulez annuler le controle", [
        //   {
        //     text: "Rester",
        //     onPress: () => { null },
        //     // style: "cancel"
        //   },
        //   { text: "Annuler", onPress:() => clearAndGoBack() }
        // ]);
        navigation.replace('EntryPage');
        console.log('going back')
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    } ,[])
  );

  const [isOptionsModalVisible, setIsOptionsModalVisible] = useState(false);
  const openOptionsModal = () => setIsOptionsModalVisible(true);


  return (
    <View
      style={[
        globalStyles.container, globalStyles.safeArea ,
        { backgroundColor: globalConsts.colors.secondaryColor },
      ]}
    >
      <View
        style={[
          {
            width: "80%",
            backgroundColor: "transparent",
            flexDirection: "column",
            paddingVertical : 20
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
            onPress={() => navigation.navigate('IndexationCamera')}
          >
            <Image
              style={{ height : 75 , width : 75 }}
              source={require("../../assets/logo/new.png")}
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
                  Nouvelle indexation
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
            onPress={() => navigation.navigate('IndexationListLocal')}
          >
            <Image
              style={{ height : 60 , width : 60 }}
              source={require("../../assets/logo/index.png")}
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
              <TouchableOpacity
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
                  Indexations locaux
                </Text>
              </TouchableOpacity>
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
            // onPress={() => navigation.replace('IndexationList')}
            onPress={openOptionsModal}

          >
            <Image
              style={{ height : 75 , width : 75 }}
              source={require("../../assets/logo/new.png")}
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
                    Autres Indexations
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <IndexationOptionsModal
        visible={isOptionsModalVisible}
        setVisible={setIsOptionsModalVisible}
        onIndexed={()=>{
          navigation.replace('IndexationListIndexed')
        }}
        onNotIndexed={() => {
          navigation.replace('IndexationList')
        }}
        onInterne={() => {
          navigation.replace('IndexationListInterne')
        }}
      />
    </View>
  );
}
