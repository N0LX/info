import { View, StyleSheet } from 'react-native'
import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react'
import { Text, Button, TextInput, Icon, Searchbar } from 'react-native-paper';

export default function ItemDetails({navigation}) {
  const Next = () => {
    console.log('Next page')
    navigation.navigate('CDetails')
}
const Capture = () => {
  console.log('Capture page')
  // navigation.navigate('CDetails')
}
const Upload = () => {
  console.log('Upload page')
  // navigation.navigate('CDetails')
}
  return (
     <View style={styles}>
          <Text>Item Details</Text>
          <TextInput label="Name"></TextInput>
          <TextInput label="Email"></TextInput>
            <TextInput label="Phone no."></TextInput>
            <TextInput label="Address"></TextInput>
            <TextInput label="Password"></TextInput>
            <TextInput label="Reenter Password"></TextInput>
            <Button onPress={Next}>Next</Button>
            <Button onPress={Capture}>Capture</Button>
            <Button onPress={Upload}>Upload</Button>
        </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})