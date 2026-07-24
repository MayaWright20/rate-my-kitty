import { Image } from "expo-image";
import { ComponentProps, ReactNode } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { COLORS } from "@/constants/colors";
import useVoting from "@/hooks/useVoting";
import { CatImage } from "@/types";

import FavouriteIconButton from "../buttons/favourite-icon-btn";
import VoteButton from "../buttons/voting-btn";

type ExpoImageProps = ComponentProps<typeof Image>;

interface Props {
  children?: ReactNode;
  contentFit?: ExpoImageProps["contentFit"];
  contentPosition?: ExpoImageProps["contentPosition"];
  favouriteButton?: {
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
  children,
  contentFit = "cover",
  contentPosition = "center",
  favouriteButton,
  image,
  imageStyle,
  wrapperStyle
}: Props) {
  const { count, downvote, upvote } = useVoting(image.id);

  if (!(children || favouriteButton || wrapperStyle)) return;
  return (
    <View style={[styles.wrapper, wrapperStyle]}>
      <Image
        cachePolicy="memory-disk"
        contentFit={contentFit}
        contentPosition={contentPosition}
        recyclingKey={image.id}
        source={{ uri: image.url }}
        style={[
          styles.image,
          {
            borderColor:
              IMAGE_BORDER_COLORS[
                Math.floor(Math.random() * IMAGE_BORDER_COLORS.length)
              ]
          },
          imageStyle
        ]}
      />
      {favouriteButton && (
        <FavouriteIconButton
          disabled={favouriteButton.disabled}
          isFavourite={favouriteButton.isFavourite}
          onPress={favouriteButton.onPress}
          size={favouriteButton.size}
        />
      )}
      <VoteButton count={count} onDownvote={downvote} onUpvote={upvote} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: COLORS.CREAM[0]
  },
  wrapper: {
    position: "relative"
  }
});
