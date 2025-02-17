import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, ActivityIndicator, Card, Divider } from 'react-native-paper';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
const URL='https://info-bxcl.onrender.com'

export default function OrderDetails() {
  const navigation = useNavigation();
  const route = useRoute();
  const { order_id } = route.params;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${URL}/order/get/${order_id}`)
      .then((response) => response.json())
      .then((data) => {
        setOrder(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching order details:', error);
        setLoading(false);
      });
  }, [order_id]);

  if (loading) {
    return <ActivityIndicator animating={true} size="large" style={styles.loader} />;
  }

  if (!order) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Order not found</Text>
        <Button mode="contained" onPress={() => navigation.goBack()} style={styles.button}>
          Back
        </Button>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Order Details" titleStyle={styles.header} />
        <Card.Content>
          <Text style={styles.label}>Order ID: <Text style={styles.value}>{order.order_id}</Text></Text>
          <Text style={styles.label}>Date: <Text style={styles.value}>{order.order_date}</Text></Text>
          <Text style={styles.label}>Status: <Text style={[styles.value, styles.status]}>{order.order_status}</Text></Text>
          <Text style={styles.label}>Shipping Address:</Text>
          <Text style={styles.value}>{order.shipping_address}</Text>
          <Divider style={styles.divider} />
          <Text style={styles.label}>Total Price: <Text style={styles.price}>₹{order.total_price}</Text></Text>
        </Card.Content>
      </Card>

      <Text style={styles.subHeader}>Ordered Items</Text>
      {order.items.map((item, index) => (
        <Card key={index} style={styles.itemCard}>
          <Card.Content>
            <Text style={styles.label}>Product: <Text style={styles.value}>{item.product_name}</Text></Text>
            <Text style={styles.label}>Quantity: <Text style={styles.value}>{item.quantity}</Text></Text>
            <Text style={styles.label}>Price: <Text style={styles.price}>₹{item.price}</Text></Text>
          </Card.Content>
        </Card>
      ))}

      <Button mode="contained" onPress={() => navigation.goBack()} style={styles.button}>
        Back
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    borderRadius: 12,
    elevation: 4,
    backgroundColor: '#ffffff',
    paddingBottom: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 15,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 2,
  },
  value: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#555',
  },
  status: {
    fontWeight: 'bold',
    color: '#e67e22', // Orange color for status
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27ae60', // Green color for prices
  },
  divider: {
    marginVertical: 10,
  },
  itemCard: {
    width: '100%',
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 3,
    marginBottom: 10,
    padding: 10,
  },
  button: {
    marginTop: 20,
    width: '90%',
    borderRadius: 8,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
});
