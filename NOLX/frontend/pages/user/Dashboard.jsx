import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Text, Button, IconButton, Searchbar, Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
const URL='https://info-bxcl.onrender.com'

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showMorePicks, setShowMorePicks] = useState(false);
  const [showMoreRecentlyAdded, setShowMoreRecentlyAdded] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [filteredResults, setFilteredResults] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [todaysPicks, setTodaysPicks] = useState([]);
  const [recentlyAdded, setRecentlyAdded] = useState([]);
  const [numColumns, setNumColumns] = useState(2); // ✅ Define numColumns

  const navigation = useNavigation();

  useEffect(() => {
    axios.get(`${URL}/product`)  
      .then((response) => {
        const products = response.data.data;
        setTodaysPicks(products.slice(0, 6));
        setRecentlyAdded(products);
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
    <TouchableOpacity style={styles.cardContainer} onPress={() => handleItemPress(item)}>
      <Card style={styles.card}>
        <Image source={{ uri: item.image_url }} style={styles.itemImage} resizeMode="cover" />
        <View style={styles.textContainer}>
          <Text style={styles.itemName}>{item.product_name}</Text>
          <Text style={styles.itemPrice}>₹{item.price}</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>🏡 Home</Text>

      {/* Search Bar */}
      <Searchbar
        placeholder="Search products..."
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchbar}
      />

      {/* Sorting Button */}
      <View style={styles.filterContainer}>
        <Button mode="contained" onPress={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
          {sortOrder === 'asc' ? 'Sort: Low to High' : 'Sort: High to Low'}
        </Button>
      </View>

      {/* Search Results */}
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
          />
        </View>
      )}


      {/* Today's Picks */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🔥 Today's Picks</Text>
          <IconButton
            icon={showMorePicks ? 'chevron-up' : 'chevron-down'}
            size={24}
            onPress={() => setShowMorePicks(!showMorePicks)}
          />
        </View>
        <FlatList
  data={todaysPicks.slice(0, showMorePicks ? todaysPicks.length : 3)}
  renderItem={renderItem}
  keyExtractor={(item) => item.product_id.toString()}
  horizontal={!showMorePicks} // Horizontal only when `showMorePicks` is false
  numColumns={showMorePicks ? 2 : 1} // Apply numColumns only when not horizontal
  key={showMorePicks ? 'grid' : 'list'} // Forces re-render when switching layout
/>

      </View>

      {/* Recently Added */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🆕 Recently Added</Text>
          <IconButton
            icon={showMoreRecentlyAdded ? 'chevron-up' : 'chevron-down'}
            size={24}
            onPress={() => setShowMoreRecentlyAdded(!showMoreRecentlyAdded)}
          />
        </View>
        <FlatList
  data={recentlyAdded.slice(0, showMoreRecentlyAdded ? recentlyAdded.length : 4)}
  renderItem={renderItem}
  keyExtractor={(item) => item.product_id.toString()}
  horizontal={!showMoreRecentlyAdded} // Horizontal only when `showMorePicks` is false
  numColumns={showMoreRecentlyAdded ? 2 : 1} // Apply numColumns only when not horizontal
  key={showMoreRecentlyAdded ? 'grid' : 'list'} // Forces re-render when switching layout
/>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 12,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  searchbar: {
    marginBottom: 12,
    borderRadius: 8,
  },
  filterContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  section: {
    marginBottom: 20,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
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
    color: '#333',
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 10,
  },
  card: {
    width: 160,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  itemImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 5,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  itemPrice: {
    fontSize: 14,
    color: '#28A745',
    fontWeight: 'bold',
    marginTop: 5,
  },
});

