import React, { useState, useEffect } from "react";
import { View, StyleSheet, Modal, ScrollView, Image } from "react-native";
import { Text, Button, TextInput, Card } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dropdown } from "react-native-element-dropdown";
import * as ImagePicker from "expo-image-picker";
const URL='https://info-bxcl.onrender.com'

export default function AddItem({ navigation }) {
  const [productName, setProductName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [categories, setCategories] = useState([]);
  const [userId, setUserId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (token) {
          const decodedToken = JSON.parse(atob(token.split(".")[1]));
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
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${URL}/category/all`);
        const result = await response.json();
        console.log("Categories fetched:", result);
        if (result.status === "success" && Array.isArray(result.data)) {
          const formattedCategories = result.data.map((cat) => ({
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

  const showModal = (message) => {
    setModalMessage(message);
    setModalVisible(true);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      showModal("Permission denied to access media library.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log("ImagePicker Result:", result);

    if (!result.canceled && result.assets?.length > 0) {
      const selectedImage = result.assets[0];

      console.log("Selected Image URI:", selectedImage.uri);
      setImage(selectedImage.uri); 

      try {
        const response = await fetch(`${URL}/upload/upload`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ photoUri: selectedImage.uri }),
        });

        const data = await response.json();
        console.log("Upload Response:", data);

        if (data.imageUrl) {
          setImageUrl(data.imageUrl);
        } else {
          showModal("Failed to upload image.");
        }
      } catch (error) {
        console.error("Error sending image URI:", error);
        showModal("Error uploading image.");
      }
    }
  };

  const confirmAddItem = async () => {
    const authToken = await AsyncStorage.getItem("authToken");
    try {
      const productData = {
        product_name: productName,
        seller_id: userId,
        category_id: parseInt(categoryId),
        description,
        stock: parseInt(stock),
        price: parseFloat(price),
        image_url: imageUrl,
      };

      const response = await fetch(`${URL}/product/add`, {
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
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>🛍 Add Product</Text>

        {/* Image Upload Section */}
        <Button mode="contained" style={styles.imageButton} onPress={pickImage}>
          Choose Image
        </Button>

        {/* Image Frame */}
        <View style={styles.imageContainer}>
  {image ? (
    <Image source={{ uri: image }} style={styles.previewImage} resizeMode="cover" />
  ) : (
    <Text style={styles.imagePlaceholder}>No Image Selected</Text>
  )}
</View>

        {/* Form Fields */}
        <TextInput
          label="Product Name"
          value={productName}
          onChangeText={setProductName}
          style={styles.input}
        />

        <Dropdown
          style={styles.dropdown}
          data={categories}
          labelField="label"
          valueField="value"
          placeholder="Select Category"
          value={categoryId}
          onChange={(item) => setCategoryId(item.value)}
        />

        <TextInput
          label="Description"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
        />

        <TextInput
          label="Stock"
          value={stock}
          onChangeText={setStock}
          keyboardType="numeric"
          style={styles.input}
        />

        <TextInput
          label="Price"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          style={styles.input}
        />

        {/* Submit Button */}
        <Button mode="contained" onPress={confirmAddItem} style={styles.submitButton}>
          Submit
        </Button>

        {/* Modal for Messages */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text>{modalMessage}</Text>
              <Button mode="text" onPress={() => setModalVisible(false)}>
                Close
              </Button>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1 },
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },

  imageContainer: {
    width: 200, // Fixed width
    height: 200, // Fixed height
    borderWidth: 2,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    marginVertical: 10,
  },

  previewImage: {
    width: "100%",
    height: "100%",
  },

  imagePlaceholder: {
    color: "#999",
    fontSize: 14,
  },

  dropdown: { marginVertical: 10, height: 50, borderWidth: 1, padding: 10 },

  modalBackground: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" },
  modalContainer: { width: 300, padding: 20, backgroundColor: "white", borderRadius: 10, alignItems: "center" },
});

