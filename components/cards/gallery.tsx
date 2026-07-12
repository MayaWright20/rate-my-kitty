import { type ReactElement, useContext, useMemo } from "react";
import {
  FlatList,
  StyleProp,
  StyleSheet,
  useWindowDimensions,
  ViewStyle
} from "react-native";

import { COLORS } from "@/constants/colors";
import { BORDER_RADIUS, BORDER_WIDTH } from "@/constants/styles";
import { IsScreenPortraitContext } from "@/context/screen-orientation-context";
import { CatImage } from "@/types";

import Card from "./card";

const GRID_GAP = 12;
const HORIZONTAL_PADDING = 16;
const GRID_MIN_THUMBNAIL_WIDTH = 140; // Change to 340
const GRID_MAX_COLUMNS = 4;
const GRID_MAX_PORTRAIT_COLUMNS = 2;
const LIST_CONTENT_MARGIN_TOP = 50;

type Props = {
  centerListImagesOnHorizontal?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
  favouriteImageIds: Record<string, boolean>;
  favouriteLoadingImageIds?: Record<string, boolean>;
  images: CatImage[];
  isGrid: boolean;
  listEmptyComponent?: ReactElement;
  listHeaderComponent?: ReactElement;
  listStyle?: StyleProp<ViewStyle>;
  onToggleFavourite: (imageId: string, image?: CatImage) => void;
};

export default function Gallery({
  centerListImagesOnHorizontal,
  contentContainerStyle,
  favouriteImageIds,
  favouriteLoadingImageIds = {},
  images,
  isGrid,
  listEmptyComponent,
  listHeaderComponent,
  listStyle,
  onToggleFavourite
}: Props) {
  const isScreenPortrait = useContext(IsScreenPortraitContext);
  const { width } = useWindowDimensions();

  const availableWidth = width - HORIZONTAL_PADDING * 2;
  const numColumns = useMemo(() => {
    if (!isGrid) {
      return 1;
    }

    const maxColumns = isScreenPortrait
      ? GRID_MAX_PORTRAIT_COLUMNS
      : GRID_MAX_COLUMNS;

    return Math.min(
      maxColumns,
      Math.max(
        1,
        Math.floor(
          (availableWidth + GRID_GAP) / (GRID_MIN_THUMBNAIL_WIDTH + GRID_GAP)
        )
      )
    );
  }, [availableWidth, isGrid, isScreenPortrait]);
  const thumbnailWidth =
    (availableWidth - GRID_GAP * (numColumns - 1)) / numColumns;

  const renderImage = ({ item }: { item: CatImage }) => {
    const isLandscape =
      item.width && item.height && !isGrid && item.width > item.height;
    const shouldCenterListImage =
      centerListImagesOnHorizontal && !isGrid && !isScreenPortrait;

    return (
      <Card
        image={item}
        contentFit="cover"
        contentPosition="center"
        wrapperStyle={
          shouldCenterListImage
            ? {
                alignSelf: "center",
                width: width * 0.4
              }
            : undefined
        }
        favouriteButton={{
          disabled: !!favouriteLoadingImageIds[item.id],
          isFavourite: !!favouriteImageIds[item.id],
          onPress: () => onToggleFavourite(item.id, item),
          size: isGrid ? "small" : "large"
        }}
        imageStyle={[
          isGrid ? styles.thumbnailImage : styles.largeListImage,
          isGrid
            ? {
                height: thumbnailWidth,
                width: thumbnailWidth
              }
            : undefined,
          {
            width:
              isLandscape || shouldCenterListImage
                ? "100%"
                : isGrid
                  ? thumbnailWidth
                  : "100%",
            aspectRatio: isLandscape ? 2 / 1.1 : isGrid ? 1 : 1.7 / 2
          }
        ]}
      />
    );
  };

  return (
    <FlatList
      key={numColumns}
      data={images}
      style={listStyle}
      numColumns={numColumns}
      keyExtractor={(item) => item.id}
      renderItem={renderImage}
      showsVerticalScrollIndicator={false}
      columnWrapperStyle={numColumns > 1 ? styles.thumbnailRow : undefined}
      contentContainerStyle={[styles.listContent, contentContainerStyle]}
      ListEmptyComponent={listEmptyComponent}
      ListHeaderComponent={listHeaderComponent}
    />
  );
}

const styles = StyleSheet.create({
  largeListImage: {
    backgroundColor: COLORS.CREAM[0],
    borderRadius: BORDER_RADIUS.MEDIUM,
    borderWidth: BORDER_WIDTH.MEDIUM,
    marginBottom: GRID_GAP
  },
  listContent: {
    marginTop: LIST_CONTENT_MARGIN_TOP,
    paddingHorizontal: HORIZONTAL_PADDING
  },
  thumbnailImage: {
    backgroundColor: COLORS.CREAM[0],
    borderRadius: BORDER_RADIUS.SMALL,
    borderWidth: BORDER_WIDTH.SMALL,
    marginBottom: GRID_GAP
  },
  thumbnailRow: {
    gap: GRID_GAP
  }
});
