import Ionicons from "@expo/vector-icons/Ionicons";
import { router, Tabs, usePathname } from "expo-router";
import { StyleSheet, View } from "react-native";

import ImageBackgroundScreen from "@/components/backgrounds/image-background-screen";
import CircularBTN from "@/components/buttons/circular-btn";
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
          name="upload/index"
          options={{
            title: "UPLOAD",
            tabBarLabelStyle: {
              color: COLORS.BLACK[3]
            },

            tabBarIcon: ({ focused }) => (
              <Ionicons
                name={"add"}
                color={focused ? COLORS.PINK[0] : COLORS.BLACK[0]}
                size={30}
              />
            )
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            tabBarButton: () => {
              const onPress = () => {
                router.push("/");
              };

              return (
                <CircularBTN
                  onPress={onPress}
                  title={"PAWFILE"}
                  style={styles.container}
                  icon={{
                    name: "paw",
                    size: 60,
                    color: pathname === "/" ? COLORS.PINK[0] : COLORS.BLACK[0]
                  }}
                />
              );
            }
          }}
        />
        <Tabs.Screen
          name="favourites/index"
          options={{
            title: "FAVOURITES",
            tabBarLabelStyle: {
              color: COLORS.BLACK[3]
            },

            tabBarIcon: ({ focused }) => (
              <Ionicons
                name={"heart"}
                color={focused ? COLORS.PINK[0] : COLORS.BLACK[0]}
                size={30}
              />
            )
          }}
        />
      </Tabs>
    </ImageBackgroundScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    top: "-70%"
  },
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
