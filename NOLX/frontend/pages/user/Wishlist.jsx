import { View, StyleSheet, FlatList, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Text, Button, Searchbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      const response = await fetch(`http://localhost:1111/wish/list/${userId}`);
      const result = await response.json();

      if (result.status === 'success') {
        setWishlistItems(result.data);  // Set fetched wishlist items with product details
        setFilteredWishlistItems(result.data); // Initialize filtered items with all wishlist items
      } else {
        console.error(result.message);  // Log if there are no items
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
      setFilteredWishlistItems(wishlistItems); // Reset to all items if search query is empty
    }
  }, [searchQuery, wishlistItems]);

  useEffect(() => {
    if (userId) {
      fetchWishlist();
    }
  }, [userId]);

  const back = () => {
    console.log('=> back');
    navigation.goBack();
  };

  const renderWishlistItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.image_url }} style={styles.productImage} />
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{item.product_name}</Text>
        <Text style={styles.productPrice}>₹{item.price}</Text>
        <Button mode="contained" onPress={() => handleRemoveFromWishlist(item.product_id)}>Remove</Button>
      </View>
    </View>
  );

  const handleRemoveFromWishlist = async (productId) => {
    try {
      const response = await fetch('http://localhost:1111/wish/remove', {
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
        console.log('Removed from wishlist');
        // Remove the item from the local state
        setWishlistItems(prevItems => prevItems.filter(item => item.product_id !== productId));
        setFilteredWishlistItems(prevItems => prevItems.filter(item => item.product_id !== productId));
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error('Error removing item from wishlist:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Wishlist</Text>
      <Searchbar
        placeholder="Search"
        onChangeText={setSearchQuery}
        value={searchQuery}
      />
      <FlatList
        data={filteredWishlistItems}
        renderItem={renderWishlistItem}
        keyExtractor={item => item.product_id.toString()}
        contentContainerStyle={styles.list}
      />
      <Button mode="contained" onPress={back}>Back</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  list: {
    flexGrow: 1,
    width: '100%',
    paddingHorizontal: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#f8f8f8',
    padding: 10,
    borderRadius: 8,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  productDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 16,
    color: '#555',
    marginVertical: 5,
  },
});
