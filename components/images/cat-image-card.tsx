import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { ComponentProps, ReactNode } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle
} from "react-native";

import { COLORS } from "@/constants/colors";
import { CatImage } from "@/types";

const IMAGE_BORDER_COLORS = [
  COLORS.BLUE[0],
  COLORS.PINK[1],
  COLORS.GREEN[0],
  COLORS.PURPLE[2],
  COLORS.CREAM[3]
];

const getImageBorderColor = (id: string) => {
  const colorIndex = id
    .split("")
    .reduce((total, character) => total + character.charCodeAt(0), 0);

  return IMAGE_BORDER_COLORS[colorIndex % IMAGE_BORDER_COLORS.length];
};

type ExpoImageProps = ComponentProps<typeof Image>;

interface Props {
  children?: ReactNode;
  contentFit?: ExpoImageProps["contentFit"];
  contentPosition?: ExpoImageProps["contentPosition"];
  favouriteButton?: {
    accessibilityLabel?: string;
    disabled?: boolean;
    isFavourite: boolean;
    onPress: () => void;
    size?: "large" | "small";
  };
  image: Pick<CatImage, "id" | "url">;
  imageStyle?: ExpoImageProps["style"];
  wrapperStyle?: StyleProp<ViewStyle>;
}

export default function CatImageCard({
  children,
  contentFit = "cover",
  contentPosition = "center",
  favouriteButton,
  image,
  imageStyle,
  wrapperStyle
}: Props) {
  const favouriteButtonSize = favouriteButton?.size ?? "small";
  const favouriteIconSize = favouriteButtonSize === "large" ? 50 : 29;
  const favouriteIconName = favouriteButton?.isFavourite
    ? "heart"
    : "heart-outline";

  const imageElement = (
    <Image
      contentFit={contentFit}
      contentPosition={contentPosition}
      source={{ uri: image.url }}
      style={[
        styles.image,
        { borderColor: getImageBorderColor(image.id) },
        imageStyle
      ]}
    />
  );

  if (children || favouriteButton || wrapperStyle) {
    return (
      <View style={[styles.wrapper, wrapperStyle]}>
        {imageElement}
        {favouriteButton && (
          <Pressable
            accessibilityLabel={
              favouriteButton.accessibilityLabel ?? "Favourite image"
            }
            accessibilityRole="button"
            disabled={favouriteButton.disabled}
            onPress={favouriteButton.onPress}
            style={[
              styles.favouriteButton,
              favouriteButtonSize === "large"
                ? styles.favouriteButtonLarge
                : styles.favouriteButtonSmall
            ]}
          >
            <Ionicons
              name={favouriteIconName}
              color={COLORS.BLACK[3]}
              size={favouriteIconSize + 2}
              style={styles.favouriteIconOutline}
            />
            <Ionicons
              name={favouriteIconName}
              color={COLORS.RED[0]}
              size={favouriteIconSize}
            />
          </Pressable>
        )}
        {children}
      </View>
    );
  }

  return imageElement;
}

const styles = StyleSheet.create({
  favouriteButton: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    zIndex: 5
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
  },
  image: {
    backgroundColor: COLORS.CREAM[0]
  },
  wrapper: {
    position: "relative"
  }
});
