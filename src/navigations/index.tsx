/* eslint-disable */ 
import { NavigationContainer } from '@react-navigation/native';
import Login from '../screen/Auth/login';
// import {createStackNavigator} from '@react-navigation/stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthNavigator from './AuthStack';
import AppNavigator from './AppStack';
import Singup from '../screen/Auth/singup';
import { AuthProvider, useAuth } from '../context/AuthContext';
import Home from '../screen/App/home';
import Verify from '../screen/Auth/verify';

// const Stack = createStackNavigator();
const Stack = createNativeStackNavigator();

const Navigation = () => {
  const {accessToken} =  useAuth()
  return (
   
      <NavigationContainer>
        {/* <Login /> */}

      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!accessToken ?
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="SignUp" component={Singup} />
            <Stack.Screen name="Verify" component={Verify} />
          </>
          :
          <Stack.Screen name="Home" component={Home} />
      }  
              </Stack.Navigator>
      </NavigationContainer>
      // </AuthProvider>
  );
};

export default Navigation;
