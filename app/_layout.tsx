import CircularBTN from "@/components/buttons/circular-btn";
import ImageBackgroundScreen from "@/components/screens/image-background-screen";
import { COLORS } from "@/constants/colors";
import { router, Tabs, usePathname } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function RootLayout() {
  const pathname = usePathname();
  return (
    <ImageBackgroundScreen>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarBackground: () => {
            return <View style={styles.tabBarBackground}></View>;
          },
        }}
      >
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
                      pathname === "/upload"
                        ? COLORS.GREEN[0]
                        : COLORS.WHITE[0],
                  }}
                />
              );
            },
          }}
        />
      </Tabs>
    </ImageBackgroundScreen>
  );
}

const styles = StyleSheet.create({
  tabBarBackground: {
    backgroundColor: COLORS.CREAM[0],
    width: "95%",
    borderRadius: "5%",
    flex: 1,
    alignSelf: "center",
    top: "-20%",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 5,
    shadowOpacity: 0.2,
  },
});
