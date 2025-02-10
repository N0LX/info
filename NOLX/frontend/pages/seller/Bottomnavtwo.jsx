import React, { useState } from "react";
import { BottomNavigation } from "react-native-paper";

import AddItem from "./AddItem";
import SellDashboard from "./SellDashboard";

export default function Bottomnavtwo({ navigation }) {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "selld", title: "Dashboard", focusedIcon: "view-dashboard-outline" },
    { key: "additem", title: "Add Item", focusedIcon: "plus-box-outline" },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    selld: () => <SellDashboard navigation={navigation} />,

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
