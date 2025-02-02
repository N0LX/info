import { View, StyleSheet,Image } from 'react-native'
import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react'
import { Text, Button, TextInput, Icon } from 'react-native-paper';

export default function login(props) {
    const onLogin = () => {
        console.log('onLogin')
        props.navigation.navigate("Home")
    }
    const onSignup = () => {
        console.log('onSignup')
        props.navigation.navigate("SignUp")
    }

    return (
        <View style={styles.container}>
       <Image source={require('./res.png')} style=
            {{height:130, width:100}}>
          </Image>

            <Text>Login</Text>
            <TextInput label="Email"></TextInput>
            <TextInput label="Password"></TextInput>
            <Button onPress={onLogin}>Login</Button>
            <Button onPress={onSignup}>Signup</Button>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#baa',
        alignItems: 'center',
        justifyContent: 'center',
    },
})

