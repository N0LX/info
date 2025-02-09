import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Button, Searchbar, Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function MyOrders() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          const decodedToken = JSON.parse(atob(token.split('.')[1]));
          setUserId(decodedToken.id);
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchOrders();
    }
  }, [userId]);

    const fetchOrders = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`http://localhost:1111/order/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Orders</Text>
      <FlatList
  data={orders}
  keyExtractor={(item) => item.order_id.toString()}
  renderItem={({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Text>Order ID: {item.order_id}</Text>
        <Text>Order Date: {item.order_date}</Text>
        <Text>Status: {item.order_status}</Text>
        <Text>Items: {item.items.map(i => `${i.product_name} (x${i.quantity})`).join(', ')}</Text>
      </Card.Content>
      <Card.Actions>
      <Button onPress={() => navigation.navigate('Odetail', { order_id: item.order_id })}>
      Details
        </Button>
      </Card.Actions>
    </Card>
  )}
/>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  card: {
    marginVertical: 5,
    padding: 10,
  },
});
