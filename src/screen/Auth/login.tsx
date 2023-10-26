/* eslint-disable */ 
import { View, Text, TouchableOpacity, Alert, TextInput, StyleSheet } from 'react-native'
import { Buffer } from 'buffer';
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import messaging from '@react-native-firebase/messaging';
import RequestUserPermission,  { NotificatonListner, getDeviceToken } from '../../utils/Notificaton';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { getUserTimezone } from '../../utils/userTimezone';

import  {SIGNIN_ENDPOINT} from "../../utils/endpoint"

const Login = () => {
  const { saveTokens, accessToken, refreshToken } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [deviceToken, setDeviceToken] = useState<string | undefined>(undefined);
  const deviceType = 'android'; // Change as needed for your application

  useEffect(() => {
    
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const FetchToken = async () => {
      const token = await getDeviceToken();
      token && setDeviceToken(token);
      // saveTokens("eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjk2ODgwMjQxLCJpYXQiOjE2OTY4Njk0NDEsImp0aSI6IjE5N2FkZjdiNmU4NjQwNjI4MDhkYzcxZjk0YzY2Mzc3IiwidXNlcl9pZCI6NDN9.lOJBy8pHqVm6Uk8m-ezwxyVoYD93ujp7lxtnf0QRWHM", "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY5Njk1NTg0MSwiaWF0IjoxNjk2ODY5NDQxLCJqdGkiOiIxMTZjOGZjMjJkMzM0ZWFkYjZkYzQzZjE2YWE2MzFiNiIsInVzZXJfaWQiOjQzfQ._tY2azYGoNJLebwdmkDM2LuIq1tY4ggS7T53HMR4E0M")
      RequestUserPermission();
      NotificatonListner();
    }
    FetchToken();
  }, []);


  const handleSignIn = async () => {
    if (deviceToken) {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password',  Buffer.from(password).toString('base64'));
      formData.append('device_token', deviceToken);
      formData.append('device_type', deviceType);
      formData.append("user_tz", getUserTimezone()); // Use the utility function
     

      try {
        const response = await axios.post(SIGNIN_ENDPOINT, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data) {
          // User authentication successful, navigate to the next screen
          // Example: navigation.navigate('Dashboard');
          console.log('res', response.data);
          if (response.data.access && response.data.refresh) {
            saveTokens(response.data.access, response.data.refresh);
            // navigation.navigate('Verify', {user_email: email});
          }
          if(response.data.code === "VERIFICATION_EMAIL_SENT")
             navigation.navigate('Verify', {email:email});
          // if user from different device id mfa code will be sent
          // navigation.navigate('Verify', {user_email, email});

        } else {
          setError(response.data.message || 'Authentication failed.');
          console.log('error', error);
        }
      } catch (error) {
        setError("An error occurred during authentication. Please try again.");
        console.log('error', error);
      }
    } else Alert.alert("You don't have a device token. Please refresh the page.");
  };





  const navigation = useNavigation();
  const handleClick = () => {
    navigation.navigate("SignUp");
    // Alert.alert("ddd")
  }
  return (
    <View style={styles.container}>
    <Text style={styles.title}>Login</Text>
    {error && <Text style={styles.error}>{error}</Text>}
    <TextInput
      style={styles.input}
      placeholder="Email"
      value={email}
      onChangeText={setEmail}
    />
    <TextInput
      style={styles.input}
      placeholder="Password"
      value={password}
      onChangeText={setPassword}
      secureTextEntry
    />
    <TouchableOpacity style={styles.button} onPress={handleSignIn}>
      <Text style={styles.buttonText}>Login</Text>
    </TouchableOpacity>
    <Text style={styles.forgotPassword}>
      Forgot password? Reset{' '}
      {/* Replace with your navigation action for the reset password screen */}
      <Text style={styles.link} onPress={() => navigation.navigate('ResetPassword')}>
        here
      </Text>
    </Text>
    <Text style={styles.signup}>
      Don’t have an account?{' '}
      {/* Replace with your navigation action for the signup screen */}
      <Text style={styles.link} onPress={() => navigation.navigate('SignUp')}>
        Signup
      </Text>
    </Text>
  </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
    width: '100%',
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPassword: {
    marginTop: 16,
    marginBottom: 8,
  },
  signup: {
    marginTop: 8,
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  error: {
    color: 'red',
    marginBottom: 16,
  },
});


export default Login