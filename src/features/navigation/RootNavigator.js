// src/features/navigation/RootNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../auth/LoginScreen';
import RegisterScreen from '../auth/RegisterScreen';
import StartScreen from '../auth/StartScreen';
import ForgotPasswordScreen from '../auth/ForgotPasswordScreen';
import TabNavigator from './TabNavigator';
import CourseDetailsScreen from '../courses/CourseDetailsScreen';
import SettingsScreen from '../profile/SettingsScreen';
import EditProfileScreen from '../profile/EditProfileScreen';
import NotificationsScreen from '../profile/NotificationsScreen';
import SecurityPrivacyScreen from '../profile/SecurityPrivacyScreen';
import { useSelector } from 'react-redux';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const user = useSelector(state => state.auth.user);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="MainTabs" component={TabNavigator} />
            <Stack.Screen name="CourseDetails" component={CourseDetailsScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
            <Stack.Screen name="SecurityPrivacy" component={SecurityPrivacyScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Start" component={StartScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
