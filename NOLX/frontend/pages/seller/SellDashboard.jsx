import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function SellDashboard(props) {
  const navigation = useNavigation();
  const [sellerProducts, setSellerProducts] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decoding JWT
          console.log("Decoded Token:", decodedToken);
          setUserId(decodedToken.id);
        }
      } catch (error) {
        console.error("🚨 Error fetching user ID:", error);
        showModal("Failed to get user details.");
      }
    };

    fetchUserId();
  }, []);


  useEffect(() => {
    axios.get('http://localhost:1111/product/')
      .then(response => {
        const products = response.data.data;
        const filteredProducts = products.filter(item => item.seller_id == userId);
        setSellerProducts(filteredProducts);
      })
      .catch(error => console.error("Error fetching seller products:", error));
  }, [userId]);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemBox}>
      <Image source={{ uri: item.image_url }} style={styles.itemImage} />
      <Text style={styles.itemName}>{item.product_name}</Text>
      <Text style={styles.itemPrice}>${item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Listings</Text>
      <FlatList
        data={sellerProducts}
        renderItem={renderItem}
        keyExtractor={(item) => item.product_id.toString()}
        numColumns={2}
      />
      <Button mode="contained" onPress={() => navigation.navigate('Home')} style={styles.button}>
        Back
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  itemBox: {
    backgroundColor: '#B1DDF2FF',
    padding: 10,
    margin: 10,
    width: 150,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
  },
  itemPrice: {
    fontSize: 14,
    color: 'green',
    marginTop: 5,
  },
  button: {
    marginTop: 10,
    alignSelf: 'center',
  },
});
