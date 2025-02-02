import React from "react";
import { BottomNavigation } from "react-native-paper";
import { Image } from 'react-native';

import AddItem from "./AddItem";
import Inventory from "./Inventory";
import Sales from "./Sales";
import SellDashboard from "./SellDashboard";

export default function Bottomnavtwo({navigation}) {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([ 
    { key: "selld", title: "SellDashboard", focusedIcon: "view-dashboard-outline" },
    { key: "inventory", title: "Inventory", focusedIcon: "archive" },
    { key: "sales", title: "Sales", focusedIcon: "chart-donut-variant" },
    { key: "additem", title: "AddItem", focusedIcon: "archive-plus" },
    
  ]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "selld":
        return <SellDashboard />;
      case "inventory":
        return <Inventory />;
      case "sales":
        return <Sales />;
      case "additem":
        return <AddItem navigation={navigation}/>;
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
