import { useEffect, useMemo, useState } from "react";
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
import { SwitchBTN } from "@/components/buttons/switch-btn";
import LogoHeader from "@/components/headers/logo-header";
import { COLORS } from "@/constants/colors";
import useProfile from "@/hooks/useProfile";
import { CatImage } from "@/types";

const GRID_GAP = 12;
const HORIZONTAL_PADDING = 16;
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

  const [isGrid, setIsGrid] = useState<boolean>(false);

  const featuredImage = images?.[0];
  const thumbnailImages = images?.slice(1) ?? [];
  const listImages = isGrid ? thumbnailImages : (images ?? []);
  const availableWidth = width - HORIZONTAL_PADDING * 2;
  const numColumns = useMemo(() => (isGrid ? 4 : 1), [isGrid]);
  const HEADER_CONTENT_OFFSET = useMemo(() => (isGrid ? 330 : 200), [isGrid]);
  const thumbnailWidth =
    (availableWidth - GRID_GAP * (numColumns - 1)) / numColumns;

  useEffect(() => {
    getProfileImages();
  }, [getProfileImages]);

  const renderImage = ({ item }: { item: CatImage }) => (
    <Image
      source={{ uri: item.url }}
      style={[
        isGrid ? styles.thumbnailImage : styles.largeListImage,
        { borderColor: getImageBorderColor(item.id) },
        isGrid ? { height: thumbnailWidth, width: thumbnailWidth } : undefined
      ]}
    />
  );

  return (
    <ImageBackgroundScreen>
      <View pointerEvents="box-none" style={styles.headerOverlay}>
        <SwitchBTN style={styles.switch} value={isGrid} onChange={setIsGrid} />
        <LogoHeader />
      </View>
      <FlatList
        key={numColumns}
        data={listImages}
        style={styles.list}
        numColumns={numColumns}
        keyExtractor={(item) => item.id}
        renderItem={renderImage}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={numColumns > 1 ? styles.thumbnailRow : undefined}
        contentContainerStyle={[
          styles.listContent,
          { paddingTop: HEADER_CONTENT_OFFSET }
        ]}
        ListHeaderComponent={
          <>
            {isLoading && <ActivityIndicator style={styles.loader} />}

            {errorMessage && (
              <Text style={styles.errorMessage}>{errorMessage}</Text>
            )}

            {isGrid && featuredImage && (
              <Image
                source={{ uri: featuredImage.url }}
                style={[
                  styles.largeImage,
                  styles.featuredImage,
                  { borderColor: getImageBorderColor(featuredImage.id) }
                ]}
              />
            )}
          </>
        }
      />
      {/* <View style={styles.btnsWrapper}>
        <CircularBTN isLarge backgroundColor={COLORS.GREEN[0]} />
        <CircularBTN isLarge backgroundColor={COLORS.PINK[1]} />
      </View> */}
    </ImageBackgroundScreen>
  );
}

const styles = StyleSheet.create({
  btnsWrapper: {
    alignSelf: "center",
    bottom: "5%",
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    width: "80%",
    zIndex: 10
  },
  errorMessage: {
    textAlign: "center"
  },
  featuredImage: {
    top: -120
  },
  headerOverlay: {
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 3
  },
  largeImage: {
    aspectRatio: 1 / 1.5,
    borderRadius: 15,
    borderWidth: 5,
    width: "100%"
  },
  largeListImage: {
    aspectRatio: 1 / 1.5,
    borderRadius: 15,
    borderWidth: 5,
    marginBottom: GRID_GAP,
    width: "100%"
  },
  list: {
    flex: 1,
    zIndex: 1
  },
  listContent: {
    paddingBottom: 32,
    paddingHorizontal: HORIZONTAL_PADDING
  },
  loader: {
    marginVertical: 16
  },
  safeAreaView: {
    flex: 1
  },
  switch: {
    bottom: "35%",
    marginRight: 5,
    position: "absolute",
    right: 0,
    zIndex: 10
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
