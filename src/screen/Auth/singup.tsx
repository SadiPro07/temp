/* eslint-disable */ 
import React, { useState } from 'react';
import { Buffer } from 'buffer';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import axios from 'axios';
import { getUserTimezone } from '../../utils/userTimezone';
import useDeviceToken from '../../hooks/useDeviceToken';
// Replace with your React Native API endpoint
import { SIGNUP_ENDPOINT } from "../../utils/endpoint";

const SignUp = () => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [deviceToken, setDeviceToken] = useState<string | undefined>(undefined);
  const deviceType = 'android'; // Change as needed for your application

  const navigation = useNavigation();

  useDeviceToken(setDeviceToken)

  const handleFirstnameChange = (value: string) => setFirstname(value);
  const handleLastnameChange = (value: string) => setLastname(value);
  const handleEmailChange = (value: string) => setEmail(value);
  const handlePasswordChange = (value: string) => setPassword(value);

  const registerUser = async () => {

    if (deviceToken) {
      const formData = new FormData();
      formData.append("first_name", firstname);
      formData.append("last_name", lastname);
      formData.append('email', email);
      formData.append('password', Buffer.from(password).toString('base64'));
      formData.append('device_token', deviceToken);
      formData.append("user_tz", getUserTimezone()); // Use the utility function
      formData.append('device_type', deviceType);
      try {
  
        const response = await axios.post(SIGNUP_ENDPOINT, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data) {
          // Registration successful, navigate to the next screen
          // Example: navigation.navigate('Verify', { email });
          Alert.alert('User Registered');
          console.log("signup", response.data);

          navigation.navigate('Verify', {user_email, email});
        } else {
          // Registration failed, handle the error
          Alert.alert('Registration failed. Please try again.');
        }
      } catch (error) {
        console.error('An error occurred while registering:', error);
        Alert.alert('An error occurred while registering. Please try again.');
      }
    }
    else Alert.alert("You don't have a device token. Please refresh the page.");

  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign up</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstname}
        onChangeText={handleFirstnameChange}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastname}
        onChangeText={handleLastnameChange}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={handleEmailChange}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={handlePasswordChange}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={registerUser}>
        <Text style={styles.buttonText}>Sign up</Text>
      </TouchableOpacity>
      <Text style={styles.login}>
        Already have an account?{' '}
        {/* Replace with your navigation action for the login screen */}
        <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
          Login
        </Text>
      </Text>
    </View>
  );
};

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
  login: {
    marginTop: 16,
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  error: {
    color: 'red',
    marginTop: 16,
  },
});

export default SignUp;
