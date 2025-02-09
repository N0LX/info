import React, { useState } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../user/CartContext';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Empty cart icon

export default function MyCart() {
  const navigation = useNavigation();
  const { cartItems, updateCart, removeFromCart } = useCart();
  const [confirmVisible, setConfirmVisible] = useState(false);

  // Function to increase quantity
  const increaseQuantity = (item) => {
    updateCart(item, item.quantity + 1);
  };

  // Function to decrease quantity (if 0, remove item from cart)
  const decreaseQuantity = (item) => {
    if (item.quantity > 1) {
      updateCart(item, item.quantity - 1);
    } else {
      removeFromCart(item); // Remove item if quantity reaches 0
    }
  };

  // Compute total items and total price
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePurchase = () => {
    setConfirmVisible(true);
  };

  const confirmPurchase = () => {
    setConfirmVisible(false);
    navigation.navigate('POrderDetails', { cartItems, totalPrice });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Cart</Text>
      <View style={styles.line} /> {/* Line below "My Cart" */}

      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="package-variant" size={60} color="#aaa" />
          <Text style={styles.emptyText}>No items are present</Text>
        </View>
      ) : (
        <>
          {/* Cart Items List */}
          <ScrollView style={styles.listContainer}>
            <FlatList
              data={cartItems}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.cartItem}>
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemName}>{item.product_name}</Text>
                    <Text style={styles.itemCategory}>Category: {item.category}</Text>
                    <Text style={styles.itemPrice}>₹{item.price}</Text>
                  </View>
                  <View style={styles.quantityContainer}>
                    <TouchableOpacity onPress={() => decreaseQuantity(item)} style={styles.button}>
                      <Text style={styles.buttonText}>➖</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <TouchableOpacity onPress={() => increaseQuantity(item)} style={styles.button}>
                      <Text style={styles.buttonText}>➕</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              ListFooterComponent={<View style={{ height: 200 }} />} // Extra space at bottom
            />
          </ScrollView>

          <View style={styles.bottomContainer}>
            <Text style={styles.summaryText}>Total Items: {totalItems}</Text>
            <Text style={styles.summaryText}>Total Price: ₹{totalPrice}</Text>
            <Button mode="contained" onPress={handlePurchase} style={styles.purchaseButton}>
              Purchase
            </Button>
          </View>
        </>
      )}

      {/* Confirmation Modal */}
      <Modal transparent={true} visible={confirmVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Do you want to proceed with the purchase?</Text>
            <View style={styles.modalButtons}>
              <Button mode="contained" onPress={confirmPurchase}>Yes</Button>
              <Button mode="outlined" onPress={() => setConfirmVisible(false)}>No</Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  line: {
    borderBottomWidth: 2,
    borderBottomColor: '#ddd',
    marginBottom: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 10,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    elevation: 3,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemCategory: {
    fontSize: 14,
    color: '#666',
  },
  itemPrice: {
    fontSize: 16,
    color: 'green',
    fontWeight: 'bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#ddd',
    padding: 5,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    minWidth: 30,
    textAlign: 'center',
  },
  bottomContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    elevation: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  purchaseButton: {
    backgroundColor: 'green',
    padding: 5,
  },
  listContainer: {
    flex: 1,
  },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%', alignItems: 'center' },
  modalText: { fontSize: 18, marginBottom: 20 },
});

