import React, { useEffect, useState } from "react";
import { View, StyleSheet, Modal } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Buffer } from "buffer";
import axios from "axios";

const API_BASE_URL = "http://localhost:1111";

export default function Account() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [password, setPassword] = useState("");
  const [showFields, setShowFields] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (token) {
          const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
          setUserId(payload.id);
        } else {
          console.error("No authToken found in AsyncStorage");
        }
      } catch (error) {
        console.error("Error decoding user ID:", error);
      }
    };

    fetchUserId();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authToken"); 
      alert("Logged out successfully!");
      navigation.replace("Login"); 
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Failed to logout. Please try again.");
    }
  };
  
  
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;

      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
          console.error("No token found in AsyncStorage");
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && response.data.data) {
          setUser(response.data.data);
          setEditedUser(response.data.data); 
        } else {
          console.error("Unexpected API response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching user details:", error.message);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleEdit = () => {
    setIsEditing(true);
    setShowFields(false);
    setPassword("");
  };

  const handleVerifyPassword = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      console.log("Auth Token:", token); 

      if (!token) {
        console.error("No token found in AsyncStorage");
        alert("Authentication error. Please log in again.");
        return;
      }

      const response = await axios.post(
        `${API_BASE_URL}/user/verify-password`,
        { userId, password },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Response:", response.data); // Debugging

      if (response.data.success) {
        setShowFields(true);
      } else {
        alert("Incorrect password!");
      }
    } catch (error) {
      console.error("Error verifying password:", error.response?.data || error.message);
      alert("Error verifying password.");
    }
  };

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");

      if (!token) {
        alert("Authentication error. Please log in again.");
        return;
      }

      const updatedFields = {
        name: editedUser.name,
        email: editedUser.email,
        phone: editedUser.phone,
        location: editedUser.location,
      };

      console.log("Sending Update:", updatedFields); // Debugging

      const response = await axios.put(
        `${API_BASE_URL}/user/${userId}`,
        updatedFields,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Update Response:", response.data); // Debugging

      if (response.data.status === "success") {  
        alert("User details updated successfully!");

        // Fetch updated data to reflect changes
        const updatedUserResponse = await axios.get(`${API_BASE_URL}/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Fetched Updated User:", updatedUserResponse.data); // Debugging

        // Update state with fresh data
        setUser(updatedUserResponse.data.data);
        setEditedUser(updatedUserResponse.data.data);
        setIsEditing(false);
      } else {
        alert("Failed to update user details!");
      }
    } catch (error) {
      console.error("Error updating user details:", error.response?.data || error.message);
      alert("Error updating user details!");
    }
  };



  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading user details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account</Text>
      <Text style={styles.detail}>Name: {user.name}</Text>
      <Text style={styles.detail}>Email: {user.email}</Text>
      <Text style={styles.detail}>Phone: {user.phone}</Text>
      <Text style={styles.detail}>Location: {user.location}</Text>

      <Button mode="contained" onPress={() => navigation.navigate("wishlist")}>
        Wishlist
      </Button>

      <Button mode="contained" onPress={handleEdit} style={styles.editButton}>
        Edit Details
      </Button>

      <Button mode="contained" onPress={handleLogout} style={styles.logoutButton}>
        Logout
      </Button>

      {/* Floating Modal for Editing */}
      <Modal animationType="slide" transparent={true} visible={isEditing}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {!showFields ? (
              <>
                <Text style={styles.modalTitle}>Enter Password to Edit</Text>
                <TextInput
                  label="Password"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  style={styles.input}
                />
                <Button mode="contained" onPress={handleVerifyPassword}>
                  Verify
                </Button>
              </>
            ) : (
              <>
                <Text style={styles.modalTitle}>Edit Details</Text>
                <TextInput
                  label="Name"
                  value={editedUser.name}
                  onChangeText={(text) => setEditedUser({ ...editedUser, name: text })}
                  style={styles.input}
                />
                <TextInput
                  label="Email"
                  value={editedUser.email}
                  onChangeText={(text) => setEditedUser({ ...editedUser, email: text })}
                  style={styles.input}
                />
                <TextInput
                  label="Phone"
                  value={editedUser.phone}
                  onChangeText={(text) => setEditedUser({ ...editedUser, phone: text })}
                  style={styles.input}
                />
                <TextInput
                  label="Location"
                  value={editedUser.location}
                  onChangeText={(text) => setEditedUser({ ...editedUser, location: text })}
                  style={styles.input}
                />
                <Button mode="contained" onPress={handleSave} style={styles.saveButton}>
                  Save
                </Button>
              </>
            )}

            <Button mode="outlined" onPress={() => setIsEditing(false)} style={styles.cancelButton}>
              Cancel
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  detail: { fontSize: 18, marginBottom: 10 },
  editButton: { marginTop: 20 },

  // Modal styles
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { width: "80%", backgroundColor: "white", padding: 20, borderRadius: 10 },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  input: { marginBottom: 10 },
  saveButton: { marginTop: 10 },
  cancelButton: { marginTop: 5 },
  logoutButton: { marginTop: 20, backgroundColor: "red", },

});

