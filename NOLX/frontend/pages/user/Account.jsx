import React, { useEffect, useState } from "react";
import { View, StyleSheet, Modal, ActivityIndicator } from "react-native";
import { Button, Text, TextInput, Card, Divider } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Buffer } from "buffer";
import axios from "axios";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const API_BASE_URL = "http://localhost:1111";

export default function Account() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [password, setPassword] = useState("");
  const [showFields, setShowFields] = useState(false);
  const [editedUser, setEditedUser] = useState({});

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (token) {
          const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
          setUserId(payload.id);
        }
      } catch (error) {
        console.error("Error decoding user ID:", error);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;

      try {
        const token = await AsyncStorage.getItem("authToken");
        const response = await axios.get(`${API_BASE_URL}/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data?.data) {
          setUser(response.data.data);
          setEditedUser(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching user details:", error.message);
      }
    };

    fetchUserData();
  }, [userId]);

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

  const handleVerifyPassword = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await axios.post(
        `${API_BASE_URL}/user/verify-password`,
        { userId, password },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setShowFields(true);
      } else {
        alert("Incorrect password!");
      }
    } catch (error) {
      console.error("Error verifying password:", error.message);
      alert("Error verifying password.");
    }
  };

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");

      const updatedFields = {
        name: editedUser.name,
        email: editedUser.email,
        phone: editedUser.phone,
        location: editedUser.location,
      };

      const response = await axios.put(
        `${API_BASE_URL}/user/${userId}`,
        updatedFields,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.status === "success") {
        alert("User details updated successfully!");
        setUser(editedUser);
        setIsEditing(false);
      } else {
        alert("Failed to update user details!");
      }
    } catch (error) {
      console.error("Error updating user details:", error.message);
      alert("Error updating user details!");
    }
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6A0DAD" />
        <Text>Loading user details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        <Icon name="account-circle" size={30} color="#6A0DAD" /> My Account
      </Text>

      {/* User Info Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.userName}>{user.name}</Text>
          <Divider style={styles.divider} />
          <Text style={styles.detail}><Icon name="email" size={18} color="#6200EE" /> {user.email}</Text>
          <Text style={styles.detail}><Icon name="phone" size={18} color="#6200EE" /> {user.phone}</Text>
          <Text style={styles.detail}><Icon name="map-marker" size={18} color="#6200EE" /> {user.location}</Text>
        </Card.Content>
      </Card>

      {/* Buttons */}
      <Button mode="contained" onPress={() => navigation.navigate("wishlist")} style={styles.button}>
        <Icon name="heart" size={20} /> Wishlist
      </Button>

      <Button mode="contained" onPress={() => setIsEditing(true)} style={styles.editButton}>
        <Icon name="pencil" size={20} /> Edit Details
      </Button>
      <br/>
      <Button mode="contained" onPress={handleLogout} style={styles.logoutButton}>
        <Icon name="logout" size={20} /> Logout
      </Button>

      {/* Edit Modal */}
      <Modal animationType="slide" transparent={true} visible={isEditing}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {!showFields ? (
              <>
                <Text style={styles.modalTitle}>Enter Password to Edit</Text>
                <TextInput label="Password" secureTextEntry value={password} onChangeText={setPassword} style={styles.input} />
                <Button mode="contained" onPress={handleVerifyPassword}>Verify</Button>
              </>
            ) : (
              <>
                <Text style={styles.modalTitle}>Edit Details</Text>
                <TextInput label="Name" value={editedUser.name} onChangeText={(text) => setEditedUser({ ...editedUser, name: text })} style={styles.input} />
                <TextInput label="Email" value={editedUser.email} onChangeText={(text) => setEditedUser({ ...editedUser, email: text })} style={styles.input} />
                <TextInput label="Phone" value={editedUser.phone} onChangeText={(text) => setEditedUser({ ...editedUser, phone: text })} style={styles.input} />
                <TextInput label="Location" value={editedUser.location} onChangeText={(text) => setEditedUser({ ...editedUser, location: text })} style={styles.input} />
                <Button mode="contained" onPress={handleSave} style={styles.saveButton}>Save</Button>
              </>
            )}
            <Button mode="outlined" onPress={() => setIsEditing(false)} style={styles.cancelButton}>Cancel</Button>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#EDE7F6" },
  title: { fontSize: 26, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  card: { padding: 20, borderRadius: 10, backgroundColor: "#FFF", elevation: 4, marginBottom: 20 },
  userName: { fontSize: 22, fontWeight: "bold" },
  detail: { fontSize: 18, marginVertical: 5 },
  button: { marginVertical: 10, backgroundColor: "#6A0DAD" },
  editButton: { backgroundColor: "#4A148C" },
  logoutButton: { backgroundColor: "#D50000" },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { width: "80%", padding: 20, backgroundColor: "#FFF", borderRadius: 10 },
});

