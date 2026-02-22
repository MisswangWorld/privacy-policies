import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';

import { useTheme } from '../hooks';
import { ArchiveScreen } from '../screens/archive-screen';
import { CellarGridScreen } from '../screens/cellar-grid-screen';
import { CreateCellarScreen } from '../screens/create-cellar-screen';
import { EditCellarScreen } from '../screens/edit-cellar-screen';
import { ListViewScreen } from '../screens/list-view-screen';
import { OnboardingScreen } from '../screens/onboarding-screen';
import { SelectPositionScreen } from '../screens/select-position-screen';
import { SettingsScreen } from '../screens/settings-screen';
import { SplashScreen } from '../screens/splash-screen';
import { WineDetailScreen } from '../screens/wine-detail-screen';
import { useCellarStore, usePreferencesStore } from '../store';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const { colors } = useTheme();
  const { hasCompletedOnboarding } = usePreferencesStore();
  const { cellars } = useCellarStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const getInitialRouteName = (): keyof RootStackParamList => {
    if (!isReady) return 'Splash';
    if (!hasCompletedOnboarding) return 'Onboarding';
    if (cellars.length === 0) return 'CreateCellar';
    return 'CellarGrid';
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={getInitialRouteName()}
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: '600',
          },
          contentStyle: {
            backgroundColor: colors.background,
          },
          headerShadowVisible: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CreateCellar"
          component={CreateCellarScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditCellar"
          component={EditCellarScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CellarGrid"
          component={CellarGridScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="WineDetail"
          component={WineDetailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ListView"
          component={ListViewScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Archive"
          component={ArchiveScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SelectPosition"
          component={SelectPositionScreen}
          options={{
            headerShown: false,
            presentation: 'modal',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
