import React ,{ useState } from "react";
import { View,Text,StyleSheet,TextInput,Button, Alert } from "react-native";
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';



const Register =({navigation}: any)=>{
    const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

 const handleRegister = async () => {
  try {
    const userCredential = await auth().createUserWithEmailAndPassword(email, pass);
    const {uid} = userCredential.user;

    await database().ref(`/users/${uid}`).set({
       uid: uid,
        email: email,
    })
    navigation.replace('Chatlist');
  } catch (error) {
    console.error('Registration failed:', error);
    Alert.alert('Registration Error');
  }
};

return (
    <View style={styles.container}>
      <View style={styles.card}>
      <Text style={styles.title}>Register</Text>
      <TextInput placeholder="Email" style={styles.input} onChangeText={setEmail} value={email} />
      <TextInput placeholder="Password" style={styles.input} secureTextEntry onChangeText={setPass} value={pass} />
      <Button title="Register" onPress={handleRegister}  />
      <Text style={styles.switchText} onPress={() => navigation.navigate('Login')}>Already have an account? Login</Text>
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
   container: 
  { 
    flex: 1, 
    justifyContent: 'center',
     padding: 20 ,
     backgroundColor: '#ffe6f0',
     borderRadius: 10 ,
     alignItems:'center',
    },
    card:{
        backgroundColor: '#fff',
        padding: 25,
        borderRadius: 15,
        width: '100%',
        maxWidth: 350,
        elevation: 8,
    },
   title: { 
    fontSize: 28,
    marginBottom: 20,
    textAlign: 'center',
    color: '#FF69B4',
    fontWeight: 'bold',
   },
  input: { borderWidth: 1, padding: 10, marginBottom: 15, borderRadius: 5 },
  switchText: { textAlign: 'center', marginTop: 10, color: 'blue' },
});


export default Register;


