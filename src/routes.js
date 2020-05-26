import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import Breeders from '~/pages/Breeders';
import BreedersForm from '~/pages/BreedersForm';
import Bulls from '~/pages/Bulls';
import BullsForm from '~/pages/BullsForm';
import Dashboard from '~/pages/Dashboard';
import Matings from '~/pages/Matings';
import MatingsForm from '~/pages/MatingsForm';
import Matrices from '~/pages/Matrices';
import MatricesForm from '~/pages/MatricesForm';
import Profile from '~/pages/Profile';
import SignIn from '~/pages/SignIn';

export default (isSignedIn = false) =>
  createAppContainer(
    createSwitchNavigator(
      {
        SignIn,
        App: createBottomTabNavigator(
          {
            Dashboard,
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
        Home: {
          screen: createStackNavigator(
            {
              Matrices,
              Breeders,
              Matings,
              Bulls,
            },
            {
              defaultNavigationOptions: {
                gestureEnabled: false,
                headerTransparent: true,
                headerTintColor: '#fff',
                headerLeftContainerStyle: {
                  marginLeft: 20,
                },
              },
            }
          ),
          navigationOptions: {
            tabBarVisible: false,
            tabBarLabel: 'Home',
            tabBarOnPress: ({ navigation }) => navigation.navigate('Dashboard'),
            tabBarIcon: (
              <Icon
                name="view-dashboard-outline"
                size={20}
                color="rgba(255,255,255,0.6)"
              />
            ),
          },
        },
        Form: {
          screen: createStackNavigator(
            {
              MatricesForm,
              BreedersForm,
              BullsForm,
              MatingsForm,
            },
            {
              defaultNavigationOptions: {
                gestureEnabled: false,
                headerTransparent: true,
                headerTintColor: '#fff',
                headerLeftContainerStyle: {
                  marginLeft: 20,
                },
              },
            }
          ),
        },
      },
      { initialRouteName: isSignedIn ? 'App' : 'SignIn' }
    )
  );
