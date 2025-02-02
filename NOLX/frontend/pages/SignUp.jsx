import {  View,StyleSheet } from 'react-native'
import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react'
import { Text, Button, TextInput, Icon } from 'react-native-paper';

export default function SignUp(props) {

  const onLogin = ()=>{
    console.log('onLogin')
    props.navigation.navigate("Login")
}
  return (
    <View style={styles}>
      <Text>SignUp</Text>
      <TextInput label="Name"></TextInput>
      <TextInput label="Email"></TextInput>
        <TextInput label="Phone no."></TextInput>
        <TextInput label="Address"></TextInput>
        <TextInput label="Password"></TextInput>
        <TextInput label="Reenter Password"></TextInput>
        <Button onPress={onLogin}>Login</Button>
    </View>
  )
}
 const styles=StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      },
 })