import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Modal, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function POrderDetails({ route }) {
  const { cartItems = [], totalPrice = 0 } = route.params || {};
  const navigation = useNavigation();
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentVisible, setPaymentVisible] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentID, setPaymentID] = useState('');
  const [idPopupVisible, setIdPopupVisible] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [transactionId, setTransactionId] = useState(null);
  const [userId, setUserId] = useState(null); // State to hold user_id

  // Decode authToken and get user_id
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decoding JWT (adjust if needed)
          setUserId(decodedToken.id);
        }
      } catch (error) {
        console.error("🚨 Error fetching user ID:", error);
        Alert.alert("Error", "Failed to get user details.");
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    console.log("id="+userId)
  }, [userId]);


  const handleProceedToPayment = () => {
    if (!shippingAddress.trim()) {
      Alert.alert("Error", "Please enter a valid shipping address.");
      return;
    }
    setPaymentVisible(true);
  };

  const handlePaymentSelection = (method) => {
    setPaymentMethod(method);
    setPaymentVisible(false);
    if (method === 'Cash') {
      handleFinalizePayment(method, null);
    } else {
      setIdPopupVisible(true);
    }
  };

  const handleFinalizePayment = async (method, id) => {
    const paymentData = {
      method,
      amount: totalPrice,
      upi_id: method === 'UPI' ? id : null,
      card_id: method === 'Card' ? id : null,
    };

    console.log("Sending Payment Data:", paymentData); // Log payment data being sent

    try {
      let response = await fetch('http://localhost:1111/payment/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData),
      });

      let result = await response.json();
      console.log("Server Response:", result); // Log server response

      if (result.success) {
        setTransactionId(result.transaction_id);
        setConfirmationVisible(true);
      } else {
        Alert.alert("Payment Failed", result.message || "Please try again.");
      }
    } catch (error) {
      console.error("API Error:", error);
      Alert.alert("Server Error", "Could not process payment.");
    }
  };

  const handleSubmitPaymentID = () => {
    if (!paymentID.trim()) {
      Alert.alert("Error", `Please enter a valid ${paymentMethod} ID`);
      return;
    }
    setIdPopupVisible(false);
    handleFinalizePayment(paymentMethod, paymentID);
  };

  const handleConfirmOrder = async () => {
    if (!userId) {
      Alert.alert("Error", "User not authenticated.");
      return;
    }

    const orderData = {
      user_id: userId, // Use the fetched user_id here
      transaction_id: transactionId,
      order_date: new Date().toISOString().split('T')[0],
      shipping_address: shippingAddress,
      total_price: totalPrice,
      items: cartItems.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    console.log("📦 Order Data Being Sent:", orderData); // Log order data

    try {
      let response = await fetch('http://localhost:1111/order/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      let result = await response.json();
      console.log("✅ Order Response:", result); // Log server response

      if (result.success) {
        Alert.alert("Order Placed!", "Your order has been successfully placed.");
        console.log("🎉 Order placed successfully:", result);

        // Navigate to PaymentSuccess with order details
        navigation.navigate('PaymentSuccess', {
          cartItems,
          totalPrice,
          shippingAddress,
          paymentMethod,
          transaction_id: transactionId
        });
      } else {
        Alert.alert("Order Failed", result.message || "Please try again.");
        console.error("❌ Order Failed:", result);
      }
    } catch (error) {
      console.error("🚨 API Error:", error);
      Alert.alert("Server Error", "Could not place order.");
    } finally {
      setConfirmationVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Details</Text>

      {cartItems.length > 0 ? (
        cartItems.map((item, index) => (
          <Text key={index} style={styles.item}>
            {item.product_name} - ₹{item.price} x {item.quantity}
          </Text>
        ))
      ) : (
        <Text style={styles.emptyCart}>Your cart is empty.</Text>
      )}

      <Text style={styles.total}>Total Price: ₹{totalPrice}</Text>

      <TextInput
        placeholder="Enter Shipping Address"
        value={shippingAddress}
        onChangeText={setShippingAddress}
        style={styles.input}
      />

      <Button mode="contained" onPress={handleProceedToPayment} style={styles.button}>
        Proceed to Payment
      </Button>

      {/* Payment Selection Modal */}
      <Modal transparent visible={paymentVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Select Payment Method</Text>
            <Button onPress={() => handlePaymentSelection('UPI')}>UPI</Button>
            <Button onPress={() => handlePaymentSelection('Card')}>Card</Button>
            <Button onPress={() => handlePaymentSelection('Cash')}>Cash</Button>
            <Button onPress={() => setPaymentVisible(false)}>Cancel</Button>
          </View>
        </View>
      </Modal>

      {/* UPI/Card ID Input Modal */}
      <Modal transparent visible={idPopupVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Enter {paymentMethod} ID</Text>
            <TextInput
              style={styles.input}
              placeholder={`Enter your ${paymentMethod} ID`}
              value={paymentID}
              onChangeText={setPaymentID}
            />
            <Button mode="contained" onPress={handleSubmitPaymentID}>Submit</Button>
            <Button onPress={() => setIdPopupVisible(false)}>Cancel</Button>
          </View>
        </View>
      </Modal>

      {/* Confirmation Modal */}
      <Modal transparent visible={confirmationVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Payment Successful!</Text>
            <Text>Payment Method: {paymentMethod}</Text>
            <Text>Transaction ID: {transactionId}</Text>
            <Text>Total Amount: ₹{totalPrice}</Text>
            <Button mode="contained" onPress={handleConfirmOrder}>Confirm Order</Button>
            <Button onPress={() => setConfirmationVisible(false)}>Cancel</Button>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  item: {
    fontSize: 18,
    marginBottom: 5,
  },
  emptyCart: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
  total: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  button: {
    marginTop: 10,
    backgroundColor: 'green',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
});
