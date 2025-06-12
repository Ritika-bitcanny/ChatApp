import React from 'react';
import { View, Text, Button,StyleSheet } from 'react-native';

const Chat = ({ navigation }: any) => {
  const handleLogout = () => {
    navigation.replace('Login'); 
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