import React, { useState } from "react";
import { BottomNavigation } from "react-native-paper";

import AddItem from "./AddItem";
import Inventory from "./Inventory";
import Sales from "./Sales";
import SellDashboard from "./SellDashboard";

export default function Bottomnavtwo({ navigation }) {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "selld", title: "Dashboard", focusedIcon: "view-dashboard-outline" },
    { key: "inventory", title: "Inventory", focusedIcon: "archive" },
    { key: "sales", title: "Sales", focusedIcon: "chart-donut-variant" },
    { key: "additem", title: "Add Item", focusedIcon: "plus-box-outline" },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    selld: () => <SellDashboard navigation={navigation} />,
    inventory: () => <Inventory navigation={navigation} />,
    sales: () => <Sales navigation={navigation} />,
    additem: () => <AddItem navigation={navigation} />,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
}
