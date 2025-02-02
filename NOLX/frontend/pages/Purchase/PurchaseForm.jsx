import {  View,StyleSheet } from 'react-native'
import { StatusBar } from 'expo-status-bar';
import React, { Component,useState } from 'react'
import { Text, Button, TextInput, Icon,Searchbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function PurchaseForm(props) {
    const [searchQuery, setSearchQuery] = React.useState('');
  const navigation = useNavigation(); 
  const back = () => {
    console.log('=> back')
    navigation.goBack()
  }
  const pay = () => {
    console.log('=> pay page')
    navigation.navigate('pay')
  }

  return (
    <View style={styles.container}>

      <Text>PurchaseForm</Text>
    <Button mode='contained' onPress={pay}>Pay Now</Button>

    <Button mode='contained' onPress={back}>Back to shop</Button>
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