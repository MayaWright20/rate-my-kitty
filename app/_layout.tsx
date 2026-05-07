import Ionicons from "@expo/vector-icons/Ionicons";
import { router, Tabs, usePathname } from "expo-router";
import { useMemo } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";

import ImageBackgroundScreen from "@/components/backgrounds/image-background-screen";
import CircularBTN from "@/components/buttons/circular-btn";
import { COLORS } from "@/constants/colors";
import { BORDER_RADIUS, OPACITY } from "@/constants/styles";
import { FavouritesContext } from "@/context/favourites-context";
import { IsScreenPortraitContext } from "@/context/screen-orientation-context";
import { VotingContext } from "@/context/voting-context";
import { useFavouritesProviderValue } from "@/hooks/useFavourites";
import { useVotingProviderValue } from "@/hooks/useVoting";

export default function RootLayout() {
  const pathname = usePathname();
  const { height, width } = useWindowDimensions();
  const favourites = useFavouritesProviderValue();
  const voting = useVotingProviderValue();

  const isScreenPortrait = useMemo(() => height >= width, [height, width]);

  return (
    <IsScreenPortraitContext.Provider value={isScreenPortrait}>
      <FavouritesContext.Provider value={favourites}>
        <VotingContext.Provider value={voting}>
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
                      name={"cloud-upload"}
                      color={focused ? COLORS.PINK[0] : COLORS.BLACK[0]}
                      size={isScreenPortrait ? 30 : 20}
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
                          size: 55,
                          color:
                            pathname === "/" ? COLORS.PINK[0] : COLORS.BLACK[0]
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
                      size={isScreenPortrait ? 30 : 20}
                    />
                  )
                }}
              />
            </Tabs>
          </ImageBackgroundScreen>
        </VotingContext.Provider>
      </FavouritesContext.Provider>
    </IsScreenPortraitContext.Provider>
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
    borderRadius: BORDER_RADIUS.MEDIUM,
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
