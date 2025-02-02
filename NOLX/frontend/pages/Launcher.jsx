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
import ConfirmDetails from "./seller/ConfirmDetails";

import OrderDetails from "./user/OrderDetails";
import PaymentPage from "./Purchase/PaymentPage";
import PurchaseForm from "./Purchase/PurchaseForm";
import OrderConfirm from "./Purchase/OrderConfirm";
import ItemDetails from "./Purchase/ItemDetails";
const Stack = createNativeStackNavigator();

export default function Launcher() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={login} />
          <Stack.Screen name="SignUp" component={signup} />
          <Stack.Screen name="wishlist" component={WishlistComponent}/>
          <Stack.Screen name="Seller" component={Seller} />
          <Stack.Screen name="Odetail" component={OrderDetails} />


          <Stack.Screen name="pay" component={PaymentPage} />
          <Stack.Screen name="item" component={ItemDetails} />
          <Stack.Screen name="purchase" component={PurchaseForm} />
          <Stack.Screen name="OConfirm" component={OrderConfirm} />

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
          <Stack.Screen name="IDetails" component={ItemDetails}/>
          <Stack.Screen name="CDetails" component={ConfirmDetails}/>
          
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

