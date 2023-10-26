/* eslint-disable */ 

import { View, Text } from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../screen/Auth/login';
import Singup from '../screen/Auth/singup';
import Home from '../screen/App/home';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={Home} />
      {/* <Stack.Screen name="SignUp" component={Singup} />
      <Stack.Screen name="Verify" component={Login} /> */}
    </Stack.Navigator>
  );
};

export default AppNavigator;
