import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import auth from '@react-native-firebase/auth';

const Splash=({navigation}:any )=>
{
    useEffect(() => {
    const timer = setTimeout(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        navigation.replace('Chatlist');
      } else {
        navigation.replace('Login');
      }
    });
    return () => unsubscribe();
  }, 3000);
      return () => clearTimeout(timer);
  }, [navigation]);
 
    return(
        <View style={styles.container}>
            <Image source={require('../assets/img.png')} style={styles.logo}/>
        </View>
    )

}

export default Splash


const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'white',
    },
    logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
    
  },
});