import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import FeedScreen from '../screens/FeedScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { MaterialIcons } from '@expo/vector-icons'; // Example of using icons

const Tab = createMaterialTopTabNavigator();

const AppNavigator = () => (
  <Tab.Navigator
    initialRouteName="Feed"
    screenOptions={{
      tabBarActiveTintColor: '#ff6c00', // Active tab text color
      tabBarInactiveTintColor: 'gray', // Inactive tab text color
      tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold' }, // Tab label style
      tabBarStyle: { backgroundColor: 'white' }, // Tab bar background color
    }}
  >
    <Tab.Screen
      name="Feed"
      component={FeedScreen}
      options={{
        tabBarIcon: ({ color }) => (
          <MaterialIcons name="rss-feed" size={24} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarIcon: ({ color }) => (
          <MaterialIcons name="person" size={24} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);

export default AppNavigator;
