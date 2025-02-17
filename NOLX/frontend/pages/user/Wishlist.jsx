import { View, StyleSheet, FlatList, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Text, Button, Searchbar, Card, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const URL='https://info-bxcl.onrender.com'

export default function WishlistComponent(props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlistItems, setWishlistItems] = useState([]);
  const [filteredWishlistItems, setFilteredWishlistItems] = useState([]);
  const navigation = useNavigation();
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

  // Fetch Wishlist Items using the list API based on userId
  const fetchWishlist = async () => {
    try {
      const response = await fetch(`${URL}/wish/list/${userId}`);
      const result = await response.json();

      if (result.status === 'success') {
        setWishlistItems(result.data);
        setFilteredWishlistItems(result.data);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Error fetching wishlist details:', error);
    }
  };

  // Filter wishlist items based on search query
  useEffect(() => {
    if (searchQuery) {
      const filteredItems = wishlistItems.filter(item =>
        item.product_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredWishlistItems(filteredItems);
    } else {
      setFilteredWishlistItems(wishlistItems);
    }
  }, [searchQuery, wishlistItems]);

  useEffect(() => {
    if (userId) {
      fetchWishlist();
    }
  }, [userId]);

  const back = () => {
    navigation.goBack();
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      const response = await fetch(`${URL}/wish/remove`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          product_id: productId,
        }),
      });

      const result = await response.json();

      if (result.status === 'success') {
        setWishlistItems(prevItems => prevItems.filter(item => item.product_id !== productId));
        setFilteredWishlistItems(prevItems => prevItems.filter(item => item.product_id !== productId));
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error('Error removing item from wishlist:', error);
    }
  };

  const renderWishlistItem = ({ item }) => (
    <Card style={styles.card}>
      <View style={styles.cardContent}>
        <Image source={{ uri: item.image_url }} style={styles.productImage} />
        <View style={styles.productDetails}>
          <Text style={styles.productName}>{item.product_name}</Text>
          <Text style={styles.productPrice}>₹{item.price}</Text>
        </View>
        <IconButton 
          icon="heart-off" 
          size={24} 
          onPress={() => handleRemoveFromWishlist(item.product_id)}
          style={styles.removeButton}
        />
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Wishlist</Text>
      <Searchbar
        placeholder="Search for products"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />
      <FlatList
        data={filteredWishlistItems}
        renderItem={renderWishlistItem}
        keyExtractor={item => item.product_id.toString()}
        contentContainerStyle={styles.list}
      />
      <Button mode="contained" onPress={back} style={styles.backButton}>
        Back
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  searchBar: {
    marginBottom: 10,
    borderRadius: 8,
  },
  list: {
    flexGrow: 1,
  },
  card: {
    marginBottom: 10,
    borderRadius: 10,
    elevation: 3,  // Adds a subtle shadow effect
    backgroundColor: '#fff',
    padding: 10,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  productDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  productPrice: {
    fontSize: 16,
    color: '#777',
    marginTop: 4,
  },
  removeButton: {
    backgroundColor: '#ff4d4d',
    borderRadius: 8,
  },
  backButton: {
    marginTop: 15,
  },
});

