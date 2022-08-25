import { View, Text, Image } from 'react-native'
import React from 'react'
import Onboarding from 'react-native-onboarding-swiper';
import { getItem, saveItem } from '../Services/store-service';
import { globalConsts } from '../Globals/global-const';
import { useDispatch, useSelector } from "react-redux";
import { setLaunch } from "../Reducers/launch-reducer";



export default function OnboardingScreen({navigation}) {

  const dispatch = useDispatch();
  const reduxLaunch = useSelector((state) => {
    return state.launch.launched;
  });

  const skip = async () => {
    saveItem(globalConsts.alias.LAUNCHED , true)
    dispatch(setLaunch(await getItem(globalConsts.alias.LAUNCHED)));
  }

  return (
    <Onboarding
    bottomBarColor='white'
    onSkip={skip}
    onDone={skip}
    imageContainerStyles={{paddingBottom :100}}
    pages={[
    {
      backgroundColor: '#fff',
      image: <Image source={require('../../assets/RD1.png')} />,
      title: 'A propos de l\'application',
      subtitle: 'Dépistage de la rétinopathie diabétique par lecture différée de photographies du fond d’œil',
    },
    {
        backgroundColor: '#fff',
        image: <Image source={require('../../assets/RD2.png')} />,
        title: 'Objectif',
        subtitle: 'prévenir la déficience visuelle due à la rétinopathie, par l’identification précoce de la maladie et la mise en place d’une interv ention adaptée.',
      },
      {
        backgroundColor: '#fff',
        image: <Image source={require('../../assets/RD3.png')} />,
        title: 'Recommandation',
        subtitle: 'Un dépistage de la rétinopathie diabétique tous les 2 ans est suffisant sous certaines conditions',
      },
  ]}
/>
  )
}