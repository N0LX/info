import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Button, Card, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function MyOrders() {
  const navigation = useNavigation();
  const [orders, setOrders] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state

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
    } finally {
      setLoading(false);
    }
  };

  const renderOrderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.orderId}>Order ID: {item.order_id}</Text>
        <Text style={styles.orderDate}>📅 {item.order_date}</Text>
        <Text style={styles.orderStatus}>🟢 Status: {item.order_status}</Text>
        <Text style={styles.items}>
          🛒 Items: {item.items.map(i => `${i.product_name} (x${i.quantity})`).join(', ')}
        </Text>
      </Card.Content>
      <Card.Actions>
        <Button mode="contained" onPress={() => navigation.navigate('Odetail', { order_id: item.order_id })}>
          View Details
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📦 My Orders</Text>
      
      {loading ? (
        <ActivityIndicator animating={true} size="large" style={styles.loader} />
      ) : orders.length === 0 ? (
        <View style={styles.noOrdersContainer}>
          <MaterialCommunityIcons name="package-variant-closed" size={80} color="#888" />
          <Text style={styles.noOrdersText}>Nothing to see here!</Text>
          <Text style={styles.subText}>You haven’t placed any orders yet.</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.order_id.toString()}
          renderItem={renderOrderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    padding: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  loader: {
    marginTop: 50,
  },
  card: {
    marginVertical: 8,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: '#fff',
  },
  orderId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  orderDate: {
    fontSize: 16,
    color: '#555',
    marginTop: 4,
  },
  orderStatus: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 6,
  },
  items: {
    fontSize: 14,
    color: '#666',
    marginTop: 6,
  },
  noOrdersContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noOrdersText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#555',
    marginTop: 10,
  },
  subText: {
    fontSize: 16,
    color: '#777',
    marginTop: 5,
    textAlign: 'center',
  },
});

