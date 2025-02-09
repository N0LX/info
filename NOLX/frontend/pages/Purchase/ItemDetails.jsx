import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useCart } from '../user/CartContext';

export default function ItemDetails() {
  const route = useRoute();
  const navigation = useNavigation();
  const { item } = route.params;
  const { addToCart } = useCart();

  const toCart = () => {
    addToCart(item);
    console.log(`${item.product_name} added to cart`);
  };

  const toWishlist = () => {
    console.log('Item added to wishlist');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{item.product_name}</Text>
      <Text style={styles.price}>${item.price}</Text>
      <Text style={styles.description}>{item.description}</Text>

      <Button mode="contained" onPress={toCart} style={styles.button}>
        Add to Cart
      </Button>
      <Button mode="contained" onPress={toWishlist} style={styles.button}>
        Add to Wishlist
      </Button>
      <Button mode="contained" onPress={() => navigation.goBack()} style={styles.button}>
        Back
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 18,
    color: 'green',
    marginVertical: 10,
  },
  description: {
    fontSize: 16,
    marginVertical: 10,
  },
  button: {
    marginVertical: 10,
  },
});
