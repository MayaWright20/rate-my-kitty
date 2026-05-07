import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet } from "react-native";

import { COLORS } from "@/constants/colors";
import { Z_INDEX } from "@/constants/styles";

type Props = {
  accessibilityLabel?: string;
  disabled?: boolean;
  isFavourite: boolean;
  onPress: () => void;
  size?: "large" | "small";
};

const FAVOURITE_ACCESSIBILITY_LABEL = "Favourite cat";

export default function FavouriteIconButton({
  accessibilityLabel = FAVOURITE_ACCESSIBILITY_LABEL,
  disabled,
  isFavourite,
  onPress,
  size = "small"
}: Props) {
  const iconSize = size === "large" ? 50 : 29;
  const iconName = isFavourite ? "heart" : "heart-outline";

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.favouriteButton,
        size === "large"
          ? styles.favouriteButtonLarge
          : styles.favouriteButtonSmall
      ]}
    >
      <Ionicons
        name={iconName}
        color={COLORS.BLACK[3]}
        size={iconSize + 2}
        style={styles.favouriteIconOutline}
      />
      <Ionicons name={iconName} color={COLORS.RED[0]} size={iconSize} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  favouriteButton: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    zIndex: Z_INDEX[5]
  },
  favouriteButtonLarge: {
    height: 58,
    left: 14,
    top: 14,
    width: 58
  },
  favouriteButtonSmall: {
    height: 38,
    left: 8,
    top: 8,
    width: 38
  },
  favouriteIconOutline: {
    left: -1,
    position: "absolute"
  }
});
