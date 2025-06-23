import React from 'react';
import { View, Text, Button,StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';

const Chat = ({ navigation }: any) => {
  const handleLogout = () => {
    auth().signOut().then(() =>navigation.replace('Login') )
     .catch(error => {
      console.error(error);
    });
     
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Chat Screen!</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20 },
});

export default Chat;