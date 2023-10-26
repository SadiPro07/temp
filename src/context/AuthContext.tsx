/* eslint-disable */ 
import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { REFRESH_ACCESS_TOKEN } from "../utils/endpoint";


interface AuthContextType {
    authToken: string | null;
    accessToken: string | null,
    refreshToken: string | null,
    saveTokens: (accessToken: string, refreshToken: string) => void;
  clearTokens: () => void,
  refreshAccessToken:() => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


type AuthContextChildrenType = {
    children: React.ReactNode;
  };

export const AuthProvider = ({children}: AuthContextChildrenType) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  useEffect(() => {
    // Load tokens from AsyncStorage when the component mounts
    const loadTokens = async () => {
      try {
        const storedAccessToken = await AsyncStorage.getItem('accessToken');
        const storedRefreshToken = await AsyncStorage.getItem('refreshToken');


        // console.log("asyc", storedRefreshToken, storedAccessToken)

        if (storedAccessToken && storedRefreshToken) {
          setAccessToken(storedAccessToken);
          setRefreshToken(storedRefreshToken);
        }
      } catch (error) {
        console.error('Error loading tokens from AsyncStorage:', error);
      }
    };

    loadTokens();
  }, []);

  const saveTokens = async (newAccessToken : string, newRefreshToken : string) => {
    try {
      // Save tokens to both state and AsyncStorage
      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);

      await AsyncStorage.setItem('accessToken', newAccessToken);
        await AsyncStorage.setItem('refreshToken', newRefreshToken);
        
        console.log("save in context", accessToken);
        console.log("local storage", AsyncStorage.getItem("accessToken"))
    } catch (error) {
      console.error('Error saving tokens to AsyncStorage:', error);
    }
  };

  const clearTokens = async () => {
    try {
      // Clear tokens from both state and AsyncStorage
      setAccessToken(null);
      setRefreshToken(null);

      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
    } catch (error) {
      console.error('Error clearing tokens from AsyncStorage:', error);
    }
  };


  const refreshAccessToken = async () => {
    try {
      let formData = new FormData();
      formData.append("refresh", refreshToken);
      const response = await axios.post(
        REFRESH_ACCESS_TOKEN
        , formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

    
      const newAccessToken = response.data.access;
      saveTokens(newAccessToken, refreshToken );

      console.log('Access token refreshed:', newAccessToken);
    } catch (error) {
      console.error('Error refreshing access token:', error);
      // Handle the error, e.g., redirect to login or display a message to the user
      
    }
  }

  const contextValue = {
    accessToken,
    refreshToken,
    saveTokens,
    clearTokens,
    refreshAccessToken
  };

  return (
      <AuthContext.Provider value={{
          accessToken,
          refreshToken,
          saveTokens,
      clearTokens,
      refreshAccessToken
      
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  // console.log("context-current", context)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
