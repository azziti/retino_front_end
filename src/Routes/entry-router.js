import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useState } from "react";
import EntryScreen from "../Screens/entry-screen";
import CameraScreen from "../Screens/camera-screen";
import PatientDetails from "../Screens/patient-details";
import PredictionPage from "../Screens/prediction-screen";
import ExistingPatients from "../Screens/existing-patients-screen";
import GenerateReport from "../Screens/generate-report";
import ControleDetails from "../Screens/controle-details";
import IndexationRouter from "./indexation-router";

const Stack = createNativeStackNavigator();

export default function EntryRouter() {
  return (
    <Stack.Navigator
      initialRouteName='EntryPage'
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="EntryPage" component={EntryScreen} />
      <Stack.Screen name="ExistingPatients" component={ExistingPatients} />
      <Stack.Screen name="DetailPatient" component={PatientDetails} />
      <Stack.Screen name="Camera" component={CameraScreen} />
      <Stack.Screen name="PredictionPage" component={PredictionPage} />
      <Stack.Screen name="GenerateRapport" component={GenerateReport} />
      <Stack.Screen name="ControleDetails" component={ControleDetails} />
      <Stack.Screen name="Indexation" component={IndexationRouter} />

    </Stack.Navigator>
  );
}
