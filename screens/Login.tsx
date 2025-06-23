import React ,{ useState } from 'react'
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import auth from '@react-native-firebase/auth'

const Login = ({navigation}: any) =>
{
        const [email,setEmail]=useState('')
        const [pass,setPass]=useState('')

        const handleLogin = async () => {
        try {
            const userCredential = await auth().signInWithEmailAndPassword(email, pass);
            console.log("User signed in:", userCredential.user.email);
            navigation.replace('Chatlist');
        } catch (error) {
            console.error("Login error:", error);
            Alert.alert('Login Error');
        }
        };

        return(
            <View style={styles.container}>
                <View style={styles.card}>
                    <Text style={styles.title}>Login</Text>
                <TextInput placeholder="Email" style={styles.input} onChangeText={setEmail} value={email} />
                <TextInput placeholder="Password" style={styles.input} secureTextEntry onChangeText={setPass} value={pass} />
                <Button title="Login" onPress={handleLogin}/>
                <Text style={styles.switchText} onPress={() => navigation.navigate('Register')}>Don't have an account? Register</Text>
            </View>
            </View>
        );
};

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
    card:
    {
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

export default Login;

