import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useState } from "react";
import IndexationEntryScreen from "../Screens/indexation-entry-page";
import IndexationList from "../Screens/indexation-list";
import IndexationCamera from "../Screens/indexation-camera";
import IndexationDetails from "../Screens/indexation-details";
import IndexationListLocal from "../Screens/indexation-list-local";
import IndexationDetailsLocal from "../Screens/indexation-details-local";
import IndexationDetailsIndexed from "../Screens/indexation-details-indexed";
import IndexationListIndexed from "../Screens/indexation-list-indexed";
import IndexationListInterne from "../Screens/indexation-list-interne";
import IndexationDetailsInterne from "../Screens/indexation-details-interne";

const Stack = createNativeStackNavigator();

export default function IndexationRouter() {
  return (
    <Stack.Navigator
      initialRouteName='IndexationEntryScreen'
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="IndexationEntryScreen" component={IndexationEntryScreen} />
      <Stack.Screen name="IndexationList" component={IndexationList} />
      <Stack.Screen name="IndexationCamera" component={IndexationCamera} />
      <Stack.Screen name="IndexationDetails" component={IndexationDetails} />
      <Stack.Screen name="IndexationListLocal" component={IndexationListLocal} />
      <Stack.Screen name="IndexationDetailsLocal" component={IndexationDetailsLocal} />
      <Stack.Screen name="IndexationDetailsIndexed" component={IndexationDetailsIndexed} />
      <Stack.Screen name="IndexationListIndexed" component={IndexationListIndexed} />
      <Stack.Screen name="IndexationListInterne" component={IndexationListInterne} />
      <Stack.Screen name="IndexationDetailsInterne" component={IndexationDetailsInterne} />



    </Stack.Navigator>
  );
}
