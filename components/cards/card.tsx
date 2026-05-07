import { Image } from "expo-image";
import { ComponentProps } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { COLORS } from "@/constants/colors";
import useVoting from "@/hooks/useVoting";
import { CatImage } from "@/types";

import FavouriteIconButton from "../buttons/favourite-icon-btn";
import VoteButton from "../buttons/voting-btn";

type ExpoImageProps = ComponentProps<typeof Image>;

interface Props {
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

const IMAGE_BORDER_COLORS = [
  COLORS.BLUE[0],
  COLORS.PINK[1],
  COLORS.GREEN[0],
  COLORS.PURPLE[2],
  COLORS.CREAM[2]
];

export default function Card({
  contentFit = "cover",
  contentPosition = "center",
  favouriteButton,
  image,
  imageStyle,
  wrapperStyle
}: Props) {
  const { count, downvote, upvote } = useVoting(image.id);
  const borderColor =
    IMAGE_BORDER_COLORS[Math.floor(Math.random() * IMAGE_BORDER_COLORS.length)];

  return (
    <View
      style={[
        styles.wrapper,
        imageStyle as StyleProp<ViewStyle>,
        { borderColor },
        wrapperStyle
      ]}
    >
      <Image
        cachePolicy="memory-disk"
        contentFit={contentFit}
        contentPosition={contentPosition}
        recyclingKey={image.id}
        source={{ uri: image.url }}
        style={styles.image}
      />
      {favouriteButton && (
        <FavouriteIconButton
          accessibilityLabel={favouriteButton.accessibilityLabel}
          disabled={favouriteButton.disabled}
          isFavourite={favouriteButton.isFavourite}
          onPress={favouriteButton.onPress}
          size={favouriteButton.size}
        />
      )}
      <VoteButton count={count} onDownvote={downvote} onUpvote={upvote} />
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    ...StyleSheet.absoluteFillObject
  },
  wrapper: {
    backgroundColor: COLORS.CREAM[0],
    overflow: "hidden",
    position: "relative"
  }
});
