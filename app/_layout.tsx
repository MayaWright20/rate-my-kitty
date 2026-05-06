import Ionicons from "@expo/vector-icons/Ionicons";
import { router, Tabs, usePathname } from "expo-router";
import { StyleSheet, View } from "react-native";

import CircularBTN from "@/components/buttons/circular-btn";
import ImageBackgroundScreen from "@/components/screens/image-background-screen";
import { COLORS } from "@/constants/colors";
import { OPACITY } from "@/constants/styles";

export default function RootLayout() {
  const pathname = usePathname();
  return (
    <ImageBackgroundScreen>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarBackground: () => {
            return <View style={styles.tabBarBackground}></View>;
          }
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "PAWFILE",
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name={focused ? "paw-sharp" : "paw-outline"}
                color={focused ? COLORS.GREEN[0] : COLORS.BLACK[0]}
                size={24}
              />
            )
          }}
        />
        <Tabs.Screen
          name="upload/index"
          options={{
            tabBarButton: () => {
              const onPress = () => {
                router.push("/upload");
              };

              return (
                <CircularBTN
                  onPress={onPress}
                  title={"Submit cat"}
                  icon={{
                    name: "add",
                    size: 60,
                    color:
                      pathname === "/upload" ? COLORS.GREEN[0] : COLORS.BLACK[0]
                  }}
                />
              );
            }
          }}
        />
      </Tabs>
    </ImageBackgroundScreen>
  );
}

const styles = StyleSheet.create({
  tabBarBackground: {
    alignSelf: "center",
    backgroundColor: COLORS.CREAM[0],
    borderRadius: "5%",
    flex: 1,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: OPACITY[0],
    shadowRadius: 5,
    top: "-20%",
    width: "95%"
  }
});
