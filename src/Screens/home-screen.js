import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
} from "react-native";
import React, { useState } from "react";
import { Button, DataTable } from "react-native-paper";
import { globalStyles } from "../Globals/global-styles";
import { globalConsts } from "../Globals/global-const";
import Header from "../Components/header";
import CustomSearchBar from "../Components/search-bar";
import FloatingButton from "../Components/simple-floating-button";

export default function HomeScreen({ navigation }) {

  // to see the DataTable documentation
  // https://callstack.github.io/react-native-paper/data-table.html
  const image = { uri: "assets/retino.jpg" };

  return (
    <SafeAreaView
      style={[
        globalStyles.AndroidSafeArea,
        globalStyles.full,
        styles.container,
      ]}
    >
      <Header title='Acceuil' />
      <View style={styles.body}>
        <CustomSearchBar />
        <View style={styles.container2}>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Name</DataTable.Title>

              <DataTable.Title numeric>Etat</DataTable.Title>
              <DataTable.Title Button> </DataTable.Title>
            </DataTable.Header>

            <DataTable.Row>
              <DataTable.Cell>Heisenberg Walter</DataTable.Cell>
              <DataTable.Cell numeric>3</DataTable.Cell>
              <DataTable.Cell>
                {" "}
                <Button> Voir </Button>{" "}
              </DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row>
              <DataTable.Cell>Karl Max </DataTable.Cell>
              <DataTable.Cell numeric>5</DataTable.Cell>
              <DataTable.Cell>
                {" "}
                <Button> Voir </Button>{" "}
              </DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row>
              <DataTable.Cell> Elon Mask </DataTable.Cell>
              <DataTable.Cell numeric>2</DataTable.Cell>
              <DataTable.Cell>
                {" "}
                <Button> Voir </Button>{" "}
              </DataTable.Cell>
            </DataTable.Row>
          </DataTable>
        </View>
        <FloatingButton iconName='help' />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: globalConsts.colors.primaryColor,
  },
  body: {
    paddingTop: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: globalConsts.colors.helperColor,
    flex: 1,
  },
  box: {
    // flex:2,
    height: 250,
    // flexDirection: "column-reverse",
    // flexWrap: "wrap",
    marginTop: 150,

    backgroundColor: "#1f65ff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  container2: {
    paddingTop: 5,
    paddingHorizontal: 30,
  },
});
