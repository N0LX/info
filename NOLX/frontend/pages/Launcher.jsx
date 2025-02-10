import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import React from 'react';
import login from "./login";
import signup from "./SignUp"

import Bottomnav  from "./Bottomnav";
import Seller from "./user/Seller";

import Bottomnavtwo from "./seller/Bottomnavtwo";
import WishlistComponent from "./user/Wishlist";
import SellDashboard from "./seller/SellDashboard";

import OrderDetails from "./user/OrderDetails";
import POrderDetails from "./Purchase/POrderDetails";
import ItemDetails from "./Purchase/ItemDetails";
import PaymentSuccess from "./Purchase/PaymentSuccess";

import { CartProvider } from './user/CartContext';
const Stack = createNativeStackNavigator();

export default function Launcher() {
  return (
    <SafeAreaProvider>
      <CartProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={login} />
          <Stack.Screen name="SignUp" component={signup} />
          <Stack.Screen name="wishlist" component={WishlistComponent}/>
          <Stack.Screen name="Seller" component={Seller} />
          <Stack.Screen name="Odetail" component={OrderDetails} />


          <Stack.Screen name="item" component={ItemDetails} />
          <Stack.Screen name="POrderDetails" component={POrderDetails} />
          <Stack.Screen name="PaymentSuccess" component={PaymentSuccess} />

          <Stack.Screen
            name="Home"
            component={Bottomnav}
            options={{ headerShown: true }} 
          />
           <Stack.Screen
            name="Selldashb"
            component={Bottomnavtwo}
            options={{ headerShown: true }} 
          />
          <Stack.Screen name="SellDashboard" component={SellDashboard} />
          
        </Stack.Navigator>
      </NavigationContainer>
      </CartProvider>
    </SafeAreaProvider>
  );
}

