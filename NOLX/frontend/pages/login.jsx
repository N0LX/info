import { View, StyleSheet, Image } from 'react-native';
import { Text, Button, TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
export default function Login({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const onLogin = async () => {
        try {
            const response = await fetch("http://localhost:1111/user/login", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            
            if (data.success) {
                await AsyncStorage.setItem('authToken', data.token);
                navigation.replace("Home"); // Redirect to Home screen
            } else {
                setError("Invalid Credentials");
            }
        } catch (error) {
            console.error("Login Error:", error);
            setError("Unable to connect to server. Check your network!");
        }
    };

    return (
        <View style={styles.container}>
            <Image source={require('./res.png')} style={styles.logo} />
            <Text variant="headlineLarge">Login</Text>
            
            {error ? <Text style={styles.error}>{error}</Text> : null}
            
            <TextInput label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
            <TextInput label="Password" value={password} onChangeText={setPassword} secureTextEntry />
            <br/>
            <Button mode="contained" onPress={onLogin}>Login</Button>
            <Button onPress={() => navigation.navigate("SignUp")}>Don't have an account? <i>Sign Up</i></Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    logo: {
        height: 130,
        width: 100,
        marginBottom: 20,
    },
    error: {
        color: 'red',
        marginBottom: 10,
    },
});
