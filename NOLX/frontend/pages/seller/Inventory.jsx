import { View, StyleSheet } from 'react-native'
import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react'
import { Text, Button, TextInput, Icon, Searchbar } from 'react-native-paper';

export default function Inventory(props) {

  return (
    <View style={styles.container}>
      <Text>Inventory</Text>
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