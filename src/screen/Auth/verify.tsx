/* eslint-disable */ 
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import axios from 'axios';
import { getUserTimezone } from '../../utils/userTimezone';
import useDeviceToken from '../../hooks/useDeviceToken';
import { useAuth } from '../../context/AuthContext';
import  {VERIFICATIONCODE_ENDPOINT}  from "../../utils/endpoint"

const Verify = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { saveTokens } = useAuth();
  const email = route.params?.email;
    const [verificationCode, setVerificationCode] = useState('');
    const [deviceToken, setDeviceToken] = useState("");
    const [resend, setResend] = useState(null);
    // const [email, setEmail] = useState('');
    const [error, setError] = useState('');
  const device_type = "android"
  console.log("user_email", route.params);

    useDeviceToken(setDeviceToken)
    
    const handleVerifyCodeChange = (value: string) => setVerificationCode(value);

  const handleVerify = async () => {
    if (deviceToken) {
        const formData = new FormData();
        formData.append('user_email', email);
        formData.append('verification_code', verificationCode);
        formData.append('device_token', deviceToken);
      formData.append('device_type', device_type);
      // formData.append("user_tz", getUserTimezone()); // Use the utility function
        formData.append('resend', resend);
  
        try {
          const response = await axios.post(VERIFICATIONCODE_ENDPOINT, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
  
          if (response.data) {
            // User authentication successful, navigate to the next screen
            // Example: navigation.navigate('Dashboard');
            console.log('res', response.data);
            if(response.data.access_token && response.data.refresh_token)
              saveTokens(response.data.access_token, response.data.refresh_token);
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
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verification Code:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter verification code"
        value={verificationCode}
        onChangeText={setVerificationCode}
        keyboardType="default"
      />
      <Text style={styles.error}>{error}</Text>
      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>
      <Text style={styles.resendText}>
        Forgot code?{' '}
        <Text
          style={styles.resendLink}
          onPress={() => Alert.alert('Resend code functionality goes here')}>
          Resend
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
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    width: '100%',
  },
  error: {
    color: 'red',
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
  },
  resendText: {
    marginTop: 20,
    textAlign: 'center',
  },
  resendLink: {
    color: 'blue',
  },
});

export default Verify;
