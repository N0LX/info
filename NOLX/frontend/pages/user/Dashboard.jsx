import {  View,StyleSheet } from 'react-native'
import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react'
import { Text, Button, TextInput, Icon, Searchbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function Dashboard(props) {
    const [searchQuery, setSearchQuery] = React.useState('');
      const navigation = useNavigation(); 
      const it = () => {
        console.log('=> PurchaseForm')
        navigation.navigate('item')
      }

  return (
    <View style={styles.container}>

      <Text>Home</Text>
      <Searchbar
      placeholder="Search"
      onChangeText={setSearchQuery}
      value={searchQuery}
    />
        <Button mode='contained' onPress={it}>item</Button>
    
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