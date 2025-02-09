import React, { useState, useEffect } from "react";
import { View, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { Text, Button, TextInput } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dropdown } from 'react-native-element-dropdown';

export default function AddItem({ navigation }) {
  const [productName, setProductName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [categories, setCategories] = useState([]);
  const [userId, setUserId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);  // Modal visibility state
  const [modalMessage, setModalMessage] = useState("");  // Modal message state

  // Fetch User ID from the JWT token stored in AsyncStorage
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

  // Fetch categories for the dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:1111/category");
        const result = await response.json();
        console.log("Categories fetched:", result);
        if (result.status === "success" && Array.isArray(result.data)) {
          const formattedCategories = result.data.map(cat => ({
            label: cat.category_name || "Unknown",
            value: cat.category_id || 1,
          }));
          setCategories(formattedCategories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Function to show modal
  const showModal = (message) => {
    setModalMessage(message);
    setModalVisible(true);
  };

  // Function to handle form submission
  const handleAddItem = async () => {
    if (!productName || !categoryId || !stock || !price || !imageUrl) {
      showModal("All fields are required.");
      return;
    }

    if (!userId) {
      showModal("User ID is not available.");
      return;
    }

    const authToken = await AsyncStorage.getItem('authToken');
    if (!authToken) {
      showModal("User not authenticated");
      return;
    }

    showModal("Do you want to add this product?");
  };

  // Function to handle confirmation of adding product
  const confirmAddItem = async () => {
    const authToken = await AsyncStorage.getItem('authToken');
    try {
      const productData = {
        product_name: productName,
        seller_id: userId,
        category_id: parseInt(categoryId), // Ensure categoryId is an integer
        description,
        stock: parseInt(stock),
        price: parseFloat(price),
        image_url: imageUrl,
      };

      const response = await fetch("http://localhost:1111/product/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(productData),
      });

      const result = await response.json();
      console.log("Response from server:", result);
      if (result.status === "success") {
        showModal("Product added successfully!");
        setProductName("");
        setCategoryId("");
        setDescription("");
        setStock("");
        setPrice("");
        setImageUrl("");
        navigation.navigate("SellDashboard");
      } else {
        showModal(result.message || "Failed to add the product.");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      showModal("Failed to add the product.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Product</Text>
      <TextInput label="Product Name" value={productName} onChangeText={setProductName} />
      
      <Dropdown
        style={styles.dropdown}
        data={categories}
        labelField="label"
        valueField="value"
        placeholder="Select Category"
        value={categoryId}
        onChange={item => {
          setCategoryId(item.value);
        }}
      />

      <TextInput label="Description" value={description} onChangeText={setDescription} />
      <TextInput label="Stock" value={stock} onChangeText={setStock} keyboardType="numeric" />
      <TextInput label="Price" value={price} onChangeText={setPrice} keyboardType="numeric" />
      <TextInput label="Image URL" value={imageUrl} onChangeText={setImageUrl} />

      <Button mode="contained" onPress={handleAddItem}>Add Item</Button>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text>{modalMessage}</Text>
            <Button mode="contained" onPress={confirmAddItem}>Confirm</Button>
            <Button mode="text" onPress={() => setModalVisible(false)}>Close</Button>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  dropdown: { margin: 16, height: 50, borderBottomWidth: 0.5 },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
});