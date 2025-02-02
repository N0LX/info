import {  View,StyleSheet } from 'react-native'
import { StatusBar } from 'expo-status-bar';
import React, { Component,useState } from 'react'
import { Text, Button, TextInput, Icon,Searchbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function MyCart(props) {
    const [searchQuery, setSearchQuery] = React.useState('');
    const navigation = useNavigation(); 
    const Purchase = () => {
      console.log('=> PurchaseForm')
      navigation.navigate('purchase')
    }
  return (
    <View style={styles.container}>

      <Text>My Cart</Text>
      <Searchbar
      placeholder="Search"
      onChangeText={setSearchQuery}
      value={searchQuery}
    />
    <Button mode='contained' onPress={Purchase}>Purchase</Button>
    
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