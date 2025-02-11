import React, { useState } from "react";
import { View, StyleSheet, Modal } from "react-native";
import { Text, Button, Checkbox } from "react-native-paper";

export default function Seller({ navigation }) {
  const [active, setActive] = useState(false);
  const [checked, setChecked] = useState(false);

  const Agreed = () => {
    console.log("Navigating to Seller Dashboard");
    navigation.navigate("Selldashb");
    setActive(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📢 Seller Guidelines</Text>

      <View style={styles.guidelines}>
        <Text style={styles.guidelineItem}>✅ Provide clear product images.</Text>
        <Text style={styles.guidelineItem}>✅ Ensure accurate descriptions.</Text>
        <Text style={styles.guidelineItem}>✅ Mention correct price and details.</Text>
        <Text style={styles.guidelineItem}>✅ Avoid prohibited items.</Text>
        <Text style={styles.guidelineItem}>✅ Respect buyer privacy and policies.</Text>
      </View>

      <View style={styles.checkboxContainer}>
        <Checkbox
          status={checked ? "checked" : "unchecked"}
          onPress={() => setChecked(!checked)}
          color="#007BFF"
        />
        <Text style={styles.checkboxText}>I have read and agree to the guidelines.</Text>
      </View>

      <Button
        mode="contained"
        style={styles.button}
        onPress={() => setActive(true)}
        disabled={!checked} // Button disabled until checkbox is checked
      >
        Add Product
      </Button>

      {/* Modal for Permission */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={active}
        onRequestClose={() => setActive(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.text}>🛑 Permission Required</Text>
            <Text style={styles.modalText}>Do you agree to follow the selling guidelines?</Text>
            <View style={styles.buttonContainer}>
              <Button onPress={() => setActive(false)} mode="outlined" style={styles.modalButton}>
                Disagree
              </Button>
              <Button onPress={Agreed} mode="contained" style={styles.modalButton}>
                Agree
              </Button>
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },
  guidelines: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    marginBottom: 20,
    elevation: 3,
  },
  guidelineItem: {
    fontSize: 16,
    color: "#555",
    marginVertical: 5,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkboxText: {
    fontSize: 16,
    color: "#444",
  },
  button: {
    backgroundColor: "#007BFF",
    width: "90%",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: "center",
    elevation: 5,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    width: "45%",
  },
});
