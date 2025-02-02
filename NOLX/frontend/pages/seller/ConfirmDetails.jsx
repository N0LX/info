import { View, StyleSheet } from 'react-native'
import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react'
import { Text, Button, Icon, Searchbar } from 'react-native-paper';

export default function ConfirmDetails({navigation}) {
    const Capture = () => {
        console.log('Capture')
    }
    const Upload = () => {
        console.log('Upload')
    }
    const Next = () => {
        console.log('Next page')
        navigation.navigate('Selldashb')
        console.log('item  added')
    }
  return (
     <View style={styles}>
          <Text>Item Details</Text>
          <Text label="Name"></Text>
          <Text label="Category"></Text>
            <Text label="Specs."></Text>
            <Text label="Price"></Text>
            <Text label="Stock"></Text>

            <Button onPress={Next}>Next</Button>

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