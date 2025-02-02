import {  View,StyleSheet } from 'react-native'
import { StatusBar } from 'expo-status-bar';
import React, { Component,useState } from 'react'
import { Text, Button, TextInput, Icon,Searchbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function PaymentPage(props) {
    const [searchQuery, setSearchQuery] = React.useState('');
  const navigation = useNavigation(); 
  const back = () => {
    console.log('=> back')
    navigation.goBack()
  }
  const confirm = () => {
    console.log('=> OrderConfirm')
    navigation.navigate('OConfirm')
  }

  return (
    <View style={styles.container}>

      <Text>PurchaseForm</Text>
    <Button mode='contained' onPress={confirm}>Place Order</Button>

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