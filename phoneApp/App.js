import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screen/LoginScreen';
import RegisterScreen from './screen/RegisterScreen';
import MapScreen from './screen/MapLocation';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} 
        options={{
          headerLeft: null,
        }}/>
        <Stack.Screen name="Map" component={MapScreen} 
        options={{
          headerLeft: null,
        }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
