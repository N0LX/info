import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, ScrollView, TouchableOpacity,Image } from 'react-native';
import { Text, Button, IconButton, Searchbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showMorePicks, setShowMorePicks] = useState(false);
  const [showMoreRecentlyAdded, setShowMoreRecentlyAdded] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [filteredResults, setFilteredResults] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [todaysPicks, setTodaysPicks] = useState([]);
  const [recentlyAdded, setRecentlyAdded] = useState([]);

  const navigation = useNavigation();

  // Fetch products from backend API
  useEffect(() => {
    axios.get('http://localhost:1111/product')  
      .then((response) => {
        const products = response.data.data; 
        setTodaysPicks(products.slice(0, 6)); // Max 6 items in Today's Picks
        setRecentlyAdded(products); // Show all products in Recently Added
      })
      .catch((error) => {
        console.error("Error fetching product data:", error);
      });
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = [...todaysPicks, ...recentlyAdded].filter(item => 
      item.product_name.toLowerCase().includes(query.toLowerCase())
    );

    if (sortOrder === 'asc') {
      filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else {
      filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    }

    setFilteredResults(filtered);
    setShowSearchResults(query !== '');
  };

  const handleCloseSearchResults = () => {
    setShowSearchResults(false);
    setSearchQuery('');
  };

  const handleItemPress = (item) => {
    navigation.navigate('item', { item });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemBox} onPress={() => handleItemPress(item)}>
       <Image 
      source={{ uri: item.image_url }} 
      style={styles.itemImage} 
      resizeMode="cover" 
    />
      <Text style={styles.itemName}>{item.product_name}</Text>
      <Text style={styles.itemPrice}>${item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Home</Text>
      <Searchbar
        placeholder="Search"
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchbar}
      />
      <View style={styles.filterContainer}>
        <Button onPress={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
          {sortOrder === 'asc' ? 'Sort by Price: Ascending' : 'Sort by Price: Descending'}
        </Button>
      </View>

      {showSearchResults && (
        <View style={styles.searchResultsContainer}>
          <IconButton
            icon="close"
            size={20}
            onPress={handleCloseSearchResults}
            style={styles.closeButton}
          />
          <FlatList
            data={filteredResults}
            renderItem={renderItem}
            keyExtractor={(item) => item.product_id.toString()}
            contentContainerStyle={styles.flatListContainer}
          />
        </View>
      )}

      {/* Today's Picks Section (Max 6 items) */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Picks</Text>
          <IconButton
            icon={showMorePicks ? 'minus' : 'plus'}
            size={20}
            onPress={() => setShowMorePicks(!showMorePicks)}
          />
        </View>
        <FlatList
          data={todaysPicks.slice(0, showMorePicks ? todaysPicks.length : 3)}
          renderItem={renderItem}
          keyExtractor={(item) => item.product_id.toString()}
          horizontal={!showMorePicks}
          numColumns={showMorePicks ? 2 : 1}
          key={showMorePicks ? 'more' : 'less'}
        />
      </View>

      {/* Recently Added Section (Show all items) */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recently Added</Text>
          <IconButton
            icon={showMoreRecentlyAdded ? 'minus' : 'plus'}
            size={20}
            onPress={() => setShowMoreRecentlyAdded(!showMoreRecentlyAdded)}
          />
        </View>
        <FlatList
  data={recentlyAdded.slice(0, showMoreRecentlyAdded ? recentlyAdded.length : 4)} // Show only 4 items when collapsed
  renderItem={renderItem}
  keyExtractor={(item) => item.product_id.toString()}
  numColumns={2} // Always in grid format
  key={showMoreRecentlyAdded ? 'more' : 'less'} // Avoid unnecessary re-renders
/>
      </View>
    </ScrollView>
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
  },
  searchbar: {
    marginBottom: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
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
  flatListContainer: {
    backgroundColor: '#89E5FCFF',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    flexGrow: 1, // Ensures items take full available space
  },
  itemBox: {
    backgroundColor: '#B1DDF2FF',
    padding: 20,
    margin: 10,
    width: 150, // Adjust width for better alignment
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    alignSelf: 'center', // Ensures individual items are centered
  },
  searchResultsContainer: {
    position: 'absolute',
    top: 100,
    left: 10,
    right: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    zIndex: 10,
    maxHeight: 200,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  itemImage: {
    width: 100, // Adjust size as needed
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
  },
  
});
