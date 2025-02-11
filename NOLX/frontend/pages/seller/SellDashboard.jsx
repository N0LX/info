import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function SellDashboard({ navigation }) {
  const [sellerProducts, setSellerProducts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          const decodedToken = JSON.parse(atob(token.split('.')[1]));
          console.log("Decoded Token:", decodedToken);
          setUserId(decodedToken.id);
        }
      } catch (error) {
        console.error("🚨 Error fetching user ID:", error);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchSellerProducts();
    }
  }, [userId]);

  const fetchSellerProducts = async () => {
    try {
      setRefreshing(true);
      const response = await axios.get('http://localhost:1111/product/');
      const products = response.data.data;
      const filteredProducts = products.filter(item => item.seller_id == userId);
      setSellerProducts(filteredProducts);
    } catch (error) {
      console.error("Error fetching seller products:", error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🛍️ Your Listings</Text>

      {sellerProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="cart-plus" size={80} color="#888" />
          <Text style={styles.emptyText}>Time to add new items!</Text>
          <Text style={styles.subText}>Start selling by listing your first product.</Text>
          <Text style={styles.emptyText}>Go to add Item button below</Text>

        </View>
      ) : (
        <FlatList
          data={sellerProducts}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.itemBox}>
              <Image source={{ uri: item.image_url }} style={styles.itemImage} />
              <Text style={styles.itemName}>{item.product_name}</Text>
              <Text style={styles.itemPrice}>💲{item.price}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.product_id.toString()}
          numColumns={2}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchSellerProducts} />}
        />
      )}

      <Button mode="contained" onPress={() => navigation.navigate('Home')} style={styles.backButton}>
        Back
      </Button>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    padding: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  itemBox: {
    backgroundColor: '#FFF',
    padding: 15,
    margin: 8,
    width: 160,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    elevation: 3,
  },
  itemImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#008000',
    marginTop: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 22,
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
  addButton: {
    marginTop: 15,
    backgroundColor: '#007BFF',
  },
  backButton: {
    marginTop: 15,
    alignSelf: 'center',
    backgroundColor: '#555',
  },
});

