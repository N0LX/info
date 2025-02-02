import React, { useState } from "react";
import { View, StyleSheet, Modal } from "react-native";
import { Text, Button } from "react-native-paper";

export default function Seller({navigation}) {
  const [active, setActive] = useState(false);

  const Agreed = ()=>{
    console.log('tosellerdashboard')
    navigation.navigate("Selldashb")
    setActive(false)
}

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seller</Text>

      <Modal
        animationType="slide"
        transparent={true}
        visible={active}
        onRequestClose={() => setActive(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.text}>Permission</Text>
            <Button onPress={() => setActive(false)}>Disagree</Button>
            <Button onPress={ Agreed }>Agree </Button>
          </View>
        </View>
      </Modal>

      <Button mode="contained" style={styles.button} onPress={() => setActive(true)}>
        Add Product
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
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
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
});
