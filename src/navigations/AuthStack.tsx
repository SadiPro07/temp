/* eslint-disable */ 

import { View, Text } from 'react-native';
import React from 'react';
// import {createStackNavigator} from '@react-navigation/stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screen/Auth/login';
import Singup from '../screen/Auth/singup';

// const Stack = createStackNavigator();
const Stack = createNativeStackNavigator();
const AuthNavigator = () => {
    return (
   
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        
       <Stack.Screen name="Login" component={Login} />
       <Stack.Screen name="SignUp" component={Singup} />
    //   {/* <Stack.Screen name="Verify" component={Login} /> */}
       </Stack.Navigator>
      
  );
};

export default AuthNavigator;
