import {  View,StyleSheet } from 'react-native'
import { StatusBar } from 'expo-status-bar';
import React, { Component,useState } from 'react'
import { Text, Button, TextInput, Icon,Searchbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function ItemDetails(props) {
    const [searchQuery, setSearchQuery] = React.useState('');
  const navigation = useNavigation(); 
  const back = () => {
    console.log('=> back')
    navigation.goBack()
  }
  const tocart = () => {
    console.log('=>Addtocart')

  }
  const towishlist = () => {
    console.log('=> Addtowishlist')
  }
  return (
    <View style={styles.container}>

      <Text>item</Text>
    <Button mode='contained' onPress={tocart}>Addtocart</Button>
    <Button mode='contained' onPress={towishlist}>Addtowishlist</Button>
    <Button mode='contained' onPress={back}>Back</Button>
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