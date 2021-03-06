import {
  StackNavigationProp,
  createStackNavigator,
} from '@react-navigation/stack';

import AuthStack from './AuthStackNavigator';
import MainStack from './MainStackNavigator';
import { NavigationContainer } from '@react-navigation/native';
import NotFound from '../screen/NotFound';
import { Platform } from 'react-native';
import React from 'react';
import WebView from '../screen/WebView';
import { useAuthContext } from '../../providers/AuthProvider';
import { useThemeContext } from '@dooboo-ui/theme';

export type RootStackParamList = {
  default: undefined;
  AuthStack: undefined;
  MainStack: undefined;
  WebView: {
    uri: string;
  };
  NotFound: undefined;
};

export type RootStackNavigationProps<
  T extends keyof RootStackParamList = 'default'
> = StackNavigationProp<RootStackParamList, T>;

const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator(): React.ReactElement {
  const { theme } = useThemeContext();

  const {
    state: { user },
  } = useAuthContext();

  return (
    <NavigationContainer
      theme={{
        colors: {
          background: theme.background,
          border: theme.border,
          card: theme.itemBackground,
          primary: theme.primary,
          notification: theme.tintColor,
          text: theme.text,
        },
        dark: true,
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTitleStyle: { color: theme.fontColor },
          headerTintColor: theme.tintColor,
          headerShown: false,
        }}
      >
        {!user || !user.verified ? (
          <Stack.Screen
            name="AuthStack"
            component={AuthStack}
            options={{
              gestureDirection: Platform.select({
                ios: !user ? 'horizontal-inverted' : 'horizontal',
                default: !user ? 'vertical-inverted' : 'vertical',
              }),
            }}
          />
        ) : (
          <Stack.Screen
            name="MainStack"
            component={MainStack}
            options={{
              gestureDirection: Platform.select({
                ios: !user ? 'horizontal-inverted' : 'horizontal',
                default: !user ? 'vertical-inverted' : 'vertical',
              }),
            }}
          />
        )}
        <Stack.Screen
          name="WebView"
          component={WebView}
          options={{
            headerShown: true,
            headerTitle: '',
            headerBackTitle: '',
          }}
        />
        <Stack.Screen name="NotFound" component={NotFound} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default RootNavigator;
