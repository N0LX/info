import React, { useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import { Text, Button, TextInput, Snackbar } from "react-native-paper";
const URL='https://info-bxcl.onrender.com'

export default function SignUp({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(""); // Snackbar message
  const [visible, setVisible] = useState(false); // Snackbar visibility

  const showSnackbar = (msg) => {
    setMessage(msg);
    setVisible(true);
  };

  const onSignUp = async () => {
    if (!name || !email || !phone || !location || !password || !confirmPassword) {
      showSnackbar("All fields are required.");
      return;
    }
    
    if (password !== confirmPassword) {
      showSnackbar("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(`${URL}/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, location, password }),
      });

      const data = await response.json(); // Get the response JSON

      if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      showSnackbar("User Registered Successfully!");

      // Navigate to Login after a delay
      setTimeout(() => navigation.navigate("Login"), 2000);
    } catch (error) {
      showSnackbar(error.message || "Something went wrong.");
      console.error("Registration Error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("./res.png")} style={styles.logo} />
      <Text variant="headlineLarge">Sign Up</Text>

      <TextInput label="Name" value={name} onChangeText={setName} />
      <TextInput label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput label="Phone no." value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <TextInput label="Address" value={location} onChangeText={setLocation} />
      <TextInput label="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <TextInput label="Re-enter Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
      <br/>
      <Button mode="contained" onPress={onSignUp}>Sign Up</Button>
      <Button onPress={() => navigation.navigate("Login")}>Already have an account?  <i>Login</i></Button>

      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={3000}
      >
        {message}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    height: 130,
    width: 100,
    marginBottom: 20,
},
});
