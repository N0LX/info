import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { Button, Card } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useCart } from '../user/CartContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ItemDetails() {
  const route = useRoute();
  const navigation = useNavigation();
  const { item } = route.params;
  const { addToCart } = useCart();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decoding JWT
          console.log("Decoded Token:", decodedToken);
          setUserId(decodedToken.id); // Assuming the user ID is in the decoded token
        }
      } catch (error) {
        console.error("🚨 Error fetching user ID:", error);
      }
    };

    fetchUserId();
  }, []);

  const toCart = () => {
    addToCart(item);
    console.log(`${item.product_name} added to cart`);
  };
  const toWishlist = async () => {
    console.log(`${item.product_id} added to ${userId}`);
  
    try {
      const productId = item.product_id;  // Assuming `item.id` is the correct product ID
  
      const response = await fetch('http://localhost:1111/wish/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: parseInt(userId),
          product_id: parseInt(item.product_id),
        }),
      });
      
      const data = await response.json();
  
      console.log("Response Data:", data);  // Log the entire response to check for errors or success
  
      if (data.status === 'success') {
        console.log(`${item.product_name} added to wishlist successfully.`);
        navigation.navigate('wishlist');
          
      } else {
        console.error('Error adding item to wishlist:', data.data); // Display the 'data' field from the backend
      }
    } catch (error) {
      console.error('Error adding item to wishlist:', error);
    }
  };
  

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        {/* Wrap Image inside a View for proper centering */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.image_url }} style={styles.image} />
        </View>
        <Card.Content>
        <Text style={styles.title}>{item.product_id}</Text>
          <Text style={styles.title}>{item.product_name}</Text>
          <Text style={styles.price}>${item.price}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button mode="contained" onPress={toCart} style={styles.button} labelStyle={styles.buttonText}>
          Add to Cart
        </Button>
        <Button mode="outlined" onPress={toWishlist} style={styles.button} labelStyle={styles.buttonText}>
          Add to Wishlist
        </Button>
        <Button mode="text" onPress={() => navigation.goBack()} style={styles.backButton} labelStyle={styles.backText}>
          Back
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4, // Shadow effect
    backgroundColor: '#ffffff',
    paddingBottom: 10,
  },
  imageContainer: {
    alignItems: 'center', // Centers the image horizontally
    justifyContent: 'center',
    paddingVertical: 10,
  },
  image: {
    height: 350,
    width: 250,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  price: {
    fontSize: 20,
    color: '#2ecc71',
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 5,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    marginVertical: 10,
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    width: '90%',
    borderRadius: 8,
    marginVertical: 10,
    paddingVertical: 5,
  },
  buttonText: {
    fontSize: 16,
  },
  backButton: {
    marginTop: 10,
  },
  backText: {
    fontSize: 16,
    color: '#3498db',
  },
});
