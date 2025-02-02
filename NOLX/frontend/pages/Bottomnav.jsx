import React from "react";
import { BottomNavigation } from "react-native-paper";
import Dashboard from "./user/Dashboard"; // Import your existing Dashboard component
import MyOrders from "./user/Myorders"; // Import your existing MyOrders component
import MyCart from "./user/MyCart"; 
import Account from "./user/Account"; // Import your existing Account component
import Seller from "./user/Seller"; // Import your existing Seller component

export default function BottomNav({navigation}) {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([ 
    { key: "dashboard", title: "Dashboard", focusedIcon: "view-dashboard" },
    { key: "myorders", title: "My Orders", focusedIcon: "shopping" },
    { key: "mycart", title: "Cart", focusedIcon: "heart" },
    { key: "account", title: "Account", focusedIcon: "account" },
    { key: "seller", title: "Seller", focusedIcon: "store" },
  ]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "dashboard":
        return <Dashboard />;
      case "myorders":
        return <MyOrders />;
      case "mycart":
        return <MyCart />;
      case "account":
        return <Account />;
      case "seller":
        return <Seller navigation={navigation} />;
      default:
        return null;
    }
  };

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
}
