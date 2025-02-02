import { View, StyleSheet } from 'react-native';
import React from 'react';
import { Text, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
export default function SellDashboard(props) {
  const navigation = useNavigation(); // Get navigation object

  const goBack = () => {
    console.log('Going back');
    navigation.navigate('Home'); 
  };

  return (
    <View style={styles.container}>
      <Text variant="titleLarge">Sell Dashboard</Text>
      <Button mode="contained" onPress={goBack} style={styles.button}>
        Back
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginTop: 10,
  },
});
