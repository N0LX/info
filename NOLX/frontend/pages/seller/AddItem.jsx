import { View, StyleSheet } from 'react-native'
import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react'
import { Text, Button, TextInput, Icon, Searchbar } from 'react-native-paper';

export default function AddItem({navigation}) {
  const Add=()=>{
    console.log('Add Item')
    navigation.navigate('IDetails')
  }

  return (
    <View style={styles.container}>
      <Text>AddItem</Text>
    <br></br>
    <Text>Instructions</Text>
      <TextInput label="ProductName"></TextInput>
            <TextInput label="Category"></TextInput>
            <Button onPress={Add}>AddItem</Button>
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