import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login'
import Register from './screens/Register'
import Chat from './screens/Chat'
import Splash from './screens/Splash';
import Chatlist from './screens/Chatlist';
import Chatscreen from './screens/Chatscreen';


const Stack=createNativeStackNavigator();
 

export default function App() {
  console.log("here")
  return(
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{headerShown:false}}>
        <Stack.Screen name="Splash" component={Splash}/>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        {/* <Stack.Screen name="Chat" component={Chat} /> */}
        <Stack.Screen name="Chatlist" component={Chatlist} />
        <Stack.Screen name="Chatscreen" component={Chatscreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
 }
