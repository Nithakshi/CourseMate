// src/features/navigation/TabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../courses/HomeScreen';
import FavouritesScreen from '../courses/FavouritesScreen';
import ProfileScreen from '../profile/ProfileScreen';
import { View, Text } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import colors from '../theme/colors';
import { useSelector } from 'react-redux';

const Tab = createBottomTabNavigator();

function DummyScreen({ name }) {
  return (
    <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
      <Text>{name}</Text>
    </View>
  );
}

export default function TabNavigator() {
  const { user } = useSelector(state => state.auth);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarStyle: { height: 64, paddingBottom: 8, paddingTop: 8 },
        tabBarIcon: ({ color }) => {
          let icon = 'home';
          if (route.name === 'Home') icon = 'home';
          if (route.name === 'Favourite') icon = 'heart';
          if (route.name === 'Profile') icon = 'user';
          return <Feather name={icon} size={20} color={color} />;
        }
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Favourite" component={FavouritesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
