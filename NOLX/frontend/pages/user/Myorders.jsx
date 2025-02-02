import {  View,StyleSheet } from 'react-native'
import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react'
import { Text, Button, TextInput, Icon, Searchbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function MyOrders(props) {
    const navigation = useNavigation(); 
  
    const [searchQuery, setSearchQuery] = React.useState('');
    const Ord = () => {
      console.log('=> details')
      navigation.navigate('Odetail')
    }

  return (
    <View style={styles.container}>

      <Text>My orders</Text>
      <Searchbar
      placeholder="Search"
      onChangeText={setSearchQuery}
      value={searchQuery}
    />

<Button mode='contained' onPress={Ord}>Details</Button>

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