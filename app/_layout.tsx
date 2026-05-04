import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="upload/index"
        options={{
          title: "upload",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={"add-sharp"}
              color={focused ? "red" : "grey"}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}
