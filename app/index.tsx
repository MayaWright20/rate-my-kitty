import { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  useWindowDimensions,
  View
} from "react-native";

import ImageBackgroundScreen from "@/components/backgrounds/image-background-screen";
import LogoHeader from "@/components/headers/logo-header";
import { COLORS } from "@/constants/colors";
import useProfile from "@/hooks/useProfile";
import { CatImage } from "@/types";

const GRID_GAP = 12;
const HORIZONTAL_PADDING = 16;
const HEADER_CONTENT_OFFSET = 330;
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

export default function Index() {
  const { getProfileImages, images, isLoading, errorMessage } = useProfile();
  const { width } = useWindowDimensions();
  const featuredImage = images?.[0];
  const thumbnailImages = images?.slice(1) ?? [];
  const availableWidth = width - HORIZONTAL_PADDING * 2;
  const numColumns = 4;
  const thumbnailWidth =
    (availableWidth - GRID_GAP * (numColumns - 1)) / numColumns;

  useEffect(() => {
    getProfileImages();
  }, [getProfileImages]);

  const renderImage = ({ item }: { item: CatImage }) => (
    <Image
      source={{ uri: item.url }}
      style={[
        styles.thumbnailImage,
        { borderColor: getImageBorderColor(item.id) },
        { height: thumbnailWidth, width: thumbnailWidth }
      ]}
    />
  );

  return (
    <ImageBackgroundScreen>
      <FlatList
        key={numColumns}
        data={thumbnailImages}
        style={styles.list}
        numColumns={numColumns}
        keyExtractor={(item) => item.id}
        renderItem={renderImage}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={numColumns > 1 ? styles.thumbnailRow : undefined}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            {isLoading && <ActivityIndicator style={styles.loader} />}

            {errorMessage && (
              <Text style={styles.errorMessage}>{errorMessage}</Text>
            )}

            {featuredImage && (
              <Image
                source={{ uri: featuredImage.url }}
                style={[
                  styles.featuredImage,
                  { borderColor: getImageBorderColor(featuredImage.id) }
                ]}
              />
            )}
          </>
        }
      />
      <View pointerEvents="none" style={styles.headerOverlay}>
        <LogoHeader />
      </View>
    </ImageBackgroundScreen>
  );
}

const styles = StyleSheet.create({
  errorMessage: {
    textAlign: "center"
  },
  featuredImage: {
    aspectRatio: 1 / 1.5,
    borderRadius: 15,
    borderWidth: 5,
    top: -100,
    width: "100%"
  },
  headerOverlay: {
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 3
  },
  list: {
    flex: 1,
    zIndex: 1
  },
  listContent: {
    paddingBottom: 32,
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: HEADER_CONTENT_OFFSET
  },
  loader: {
    marginVertical: 16
  },
  safeAreaView: {
    flex: 1
  },
  thumbnailImage: {
    borderRadius: 8,
    borderWidth: 2,
    marginBottom: GRID_GAP
  },
  thumbnailRow: {
    gap: GRID_GAP
  }
});
