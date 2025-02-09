import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PaymentSuccess({ route }) {
  const navigation = useNavigation();
  const { cartItems, totalPrice, shippingAddress, paymentMethod, transaction_id } = route.params;
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decoding JWT (adjust if needed)
          setUserId(decodedToken.user_id);
        }
      } catch (error) {
        console.error("🚨 Error fetching user ID:", error);
        Alert.alert("Error", "Failed to get user details.");
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
  }, [userId]);


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Successful!</Text>
      <Text style={styles.subtitle}>Your order has been placed successfully.</Text>
      <Text style={styles.detail}>Total Price: ₹{totalPrice}</Text>
      <Text style={styles.detail}>Payment Method: {paymentMethod}</Text>
      <Text style={styles.detail}>Shipping Address: {shippingAddress}</Text>
      <Text style={styles.detail}>Order Items:</Text>
      {cartItems.map((item, index) => (
        <Text key={index} style={styles.item}>
          {item.product_name} - ₹{item.price} x {item.quantity}
        </Text>
      ))}
      <Button mode="contained" onPress={() => navigation.navigate('Home')} style={styles.button}>
        Go to Home
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: 'green', marginBottom: 10 },
  subtitle: { fontSize: 18, marginBottom: 10 },
  detail: { fontSize: 16, marginBottom: 5 },
  item: { fontSize: 16, marginBottom: 5 },
  button: { marginTop: 20, backgroundColor: 'green' },
});
