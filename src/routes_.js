import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import Breeders from '~/pages/Breeders';
import Bulls from '~/pages/Bulls';
import Dashboard from '~/pages/Dashboard';
import Matings from '~/pages/Matings';
import Matrices from '~/pages/Matrices';
import Profile from '~/pages/Profile';
import SignIn from '~/pages/SignIn';

export default (isSignedIn = false) =>
  createAppContainer(
    createSwitchNavigator(
      {
        SignIn,
        App: createBottomTabNavigator(
          {
            Home: {
              screen: createStackNavigator(
                {
                  Dashboard,
                  Matrices,
                  Breeders,
                  Matings,
                  Bulls,
                },
                {
                  defaultNavigationOptions: {
                    gestureEnabled: false,
                    tabBarVisible: false,
                    headerTransparent: true,
                    headerTintColor: '#fff',
                    headerLeftContainerStyle: {
                      marginLeft: 20,
                    },
                  },
                }
              ),
              navigationOptions: {
                tabBarVisible: true,
                tabBarLabel: 'Home',
                tabBarOnPress: ({ navigation }) =>
                  navigation.navigate('Dashboard'),
                tabBarIcon: (
                  <Icon
                    name="view-dashboard-outline"
                    size={20}
                    color="rgba(255,255,255,0.6)"
                  />
                ),
              },
            },
            Profile,
          },
          {
            tabBarOptions: {
              keyboardHidesTabBar: true,
              activeTintColor: '#FFF',
              inactiveTintColor: 'rgba(255,255,255,0.6)',
              style: {
                backgroundColor: '#002A54',
              },
            },
          }
        ),
      },
      { initialRouteName: isSignedIn ? 'App' : 'SignIn' }
    )
  );
