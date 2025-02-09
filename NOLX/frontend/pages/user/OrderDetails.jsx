import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, ActivityIndicator } from 'react-native-paper';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function OrderDetails() {
  const navigation = useNavigation();
  const route = useRoute();
  const { order_id } = route.params;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:1111/order/get/${order_id}`)
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
        <Button mode="contained" onPress={() => navigation.goBack()}>Back</Button>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Order Details</Text>
      <Text style={styles.label}>Order ID: <Text style={styles.value}>{order.order_id}</Text></Text>
      <Text style={styles.label}>Date: <Text style={styles.value}>{order.order_date}</Text></Text>
      <Text style={styles.label}>Status: <Text style={styles.value}>{order.order_status}</Text></Text>
      <Text style={styles.label}>Shipping Address: <Text style={styles.value}>{order.shipping_address}</Text></Text>
      <Text style={styles.label}>Total Price: <Text style={styles.value}>₹{order.total_price}</Text></Text>

      <Text style={styles.subHeader}>Ordered Items</Text>
      {order.items.map((item, index) => (
        <View key={index} style={styles.item}>
          <Text style={styles.label}>Product: <Text style={styles.value}>{item.product_name}</Text></Text>
          <Text style={styles.label}>Quantity: <Text style={styles.value}>{item.quantity}</Text></Text>
          <Text style={styles.label}>Price: <Text style={styles.value}>₹{item.price}</Text></Text>
        </View>
      ))}

      <Button mode="contained" onPress={() => navigation.goBack()} style={styles.button}>
        Back
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  subHeader: { fontSize: 20, fontWeight: 'bold', marginTop: 15 },
  label: { fontSize: 16, fontWeight: 'bold' },
  value: { fontSize: 16, fontWeight: 'normal' },
  item: { backgroundColor: '#fff', padding: 10, marginTop: 10, borderRadius: 5 },
  button: { marginTop: 20 },
  errorText: { color: 'red', fontSize: 18, textAlign: 'center', marginBottom: 10 },
});
