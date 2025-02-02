import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button,Text, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function Account(props) {
  const navigation = useNavigation(); 

  const wish = () => {
    console.log('=> Wishlist')
    navigation.navigate('wishlist')
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account</Text>
      <TextInput label="Name" style={styles.input} />
      <TextInput label="Email" style={styles.input} />
      <TextInput label="Phone" style={styles.input} />
      <TextInput label="Address" style={styles.input} />
      <Button mode='contained' onPress={wish}>Wishlist</Button>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 15,
  },
});
