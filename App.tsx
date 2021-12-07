/* eslint-disable react-hooks/exhaustive-deps */
import auth from '@react-native-firebase/auth';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import ActiveAlarm from './src/pages/ActiveAlarm';
import CastList from './src/pages/CastList';
import Main from './src/pages/Main';
import Settings from './src/pages/Settings';
import {InitialPropsContext} from './src/shared/initial-props.context';

const Stack = createNativeStackNavigator();

const App = (props: any) => {
  // init user
  useEffect(() => {
    auth().signInAnonymously();
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  const [initializing, setInitializing] = useState(true);
  const [, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user: any) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  if (initializing) return null; // TODO show logo

  return (
    <NavigationContainer>
      <InitialPropsContext.Provider value={props}>
        <Stack.Navigator
          initialRouteName="Main"
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name="Main" component={Main} />
          <Stack.Screen name="CastList" component={CastList} />
          <Stack.Screen name="ActiveAlarm" component={ActiveAlarm} />
          <Stack.Screen name="Settings" component={Settings} />
        </Stack.Navigator>
      </InitialPropsContext.Provider>
    </NavigationContainer>
  );
};

export default App;
