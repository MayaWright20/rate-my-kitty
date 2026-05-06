import { LilitaOne_400Regular } from "@expo-google-fonts/lilita-one";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View
} from "react-native";

import { getFavourites, toggleFavouriteItem } from "@/api/api";
import ImageBackgroundScreen from "@/components/backgrounds/image-background-screen";
import { SwitchBTN } from "@/components/buttons/switch-btn";
import LogoHeader from "@/components/headers/logo-header";
import TitleHeader from "@/components/headers/title-header";
import { COLORS } from "@/constants/colors";
import useProfile from "@/hooks/useProfile";
import { CatImage } from "@/types";

const noImages = require("../assets/images/backgrounds/boa-cat.png");

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
  const [favouriteImageIds, setFavouriteImageIds] = useState<
    Record<string, boolean>
  >({});
  const [isFavouriteLoading, setIsFavouriteLoading] = useState(false);

  const featuredImage = images?.[0];
  const isFeaturedImageFavourite = !!(
    featuredImage && favouriteImageIds[featuredImage.id]
  );
  const thumbnailImages = images?.slice(1) ?? [];
  const listImages = isGrid ? thumbnailImages : (images ?? []);
  const availableWidth = width - HORIZONTAL_PADDING * 2;
  const numColumns = useMemo(() => (isGrid ? 2 : 1), [isGrid]);
  const HEADER_CONTENT_OFFSET = useMemo(() => (isGrid ? 330 : 200), [isGrid]);
  const thumbnailWidth =
    (availableWidth - GRID_GAP * (numColumns - 1)) / numColumns;

  useFocusEffect(
    useCallback(() => {
      const loadImagesAndFavourites = async () => {
        const [, favourites] = await Promise.all([
          getProfileImages(),
          getFavourites()
        ]);

        setFavouriteImageIds(
          favourites.reduce<Record<string, boolean>>(
            (favouriteIds, favourite) => ({
              ...favouriteIds,
              [favourite.image_id]: true
            }),
            {}
          )
        );
      };

      loadImagesAndFavourites();
    }, [getProfileImages])
  );

  const toggleFavourite = useCallback(async () => {
    if (!featuredImage || isFavouriteLoading) {
      return;
    }

    setIsFavouriteLoading(true);

    try {
      const result = await toggleFavouriteItem(featuredImage.id);
      setFavouriteImageIds((currentFavouriteImageIds) => ({
        ...currentFavouriteImageIds,
        [featuredImage.id]: result.isFavourite
      }));
    } catch (e) {
      console.error(e);
    } finally {
      setIsFavouriteLoading(false);
    }
  }, [featuredImage, isFavouriteLoading]);

  const renderImage = ({ item }: { item: CatImage }) => {
    const isLandscape =
      item.width && item.height && !isGrid && item.width > item.height;
    return (
      <Image
        source={{ uri: item.url }}
        contentFit="cover"
        contentPosition="center"
        style={[
          isGrid ? styles.thumbnailImage : styles.largeListImage,
          { borderColor: getImageBorderColor(item.id) },
          isGrid
            ? { height: thumbnailWidth, width: thumbnailWidth }
            : undefined,
          {
            width: isLandscape ? "100%" : isGrid ? "auto" : "100%",

            aspectRatio: isLandscape ? 2 / 1.1 : isGrid ? 1 : 1.7 / 2
          }
        ]}
      />
    );
  };

  return (
    <ImageBackgroundScreen style={styles.imageBackground}>
      <View pointerEvents="box-none" style={styles.headerOverlay}>
        {images.length > 0 && (
          <SwitchBTN
            style={styles.switch}
            value={isGrid}
            onChange={setIsGrid}
          />
        )}
        <LogoHeader />
      </View>
      {isLoading && images.length === 0 ? (
        <ActivityIndicator style={styles.initialLoader} />
      ) : images.length > 0 ? (
        <>
          <Pressable
            accessibilityLabel="Favourite featured image"
            accessibilityRole="button"
            disabled={!featuredImage || isFavouriteLoading}
            onPress={toggleFavourite}
            style={styles.icon}
          >
            <Ionicons
              name={isFeaturedImageFavourite ? "heart" : "heart-outline"}
              color={COLORS.BLACK[3]}
              size={53}
              style={styles.iconOutline}
            />
            <Ionicons
              name={isFeaturedImageFavourite ? "heart" : "heart-outline"}
              color={COLORS.RED[0]}
              size={50}
            />
          </Pressable>
          <FlatList
            key={numColumns}
            data={listImages}
            style={styles.list}
            numColumns={numColumns}
            keyExtractor={(item) => item.id}
            renderItem={renderImage}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={
              numColumns > 1 ? styles.thumbnailRow : undefined
            }
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
                    contentFit="contain"
                    contentPosition="center"
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
        </>
      ) : (
        <View style={styles.noImagesWrapper}>
          <Image
            source={noImages}
            style={styles.noImages}
            contentFit="contain"
            contentPosition="center"
            // pointerEvents="none"
          />
          <TitleHeader
            title={"No Kitties yet!"}
            font={LilitaOne_400Regular}
            subheading="Go to the upload screen to get started!"
          />
        </View>
      )}
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
  icon: {
    left: "10%",
    position: "absolute",
    top: "30%",
    zIndex: 5
  },
  iconOutline: {
    // left: -2,
    position: "absolute"
    // top: -3
  },
  imageBackground: {
    // alignItems: "center",
    // backgroundColor: "red",
    justifyContent: "center"
  },
  initialLoader: {
    alignSelf: "center"
  },
  largeImage: {
    aspectRatio: 1 / 1.5,
    backgroundColor: COLORS.CREAM[0],
    borderRadius: 15,
    borderWidth: 5,
    width: "100%"
  },
  largeListImage: {
    // aspectRatio: 1 / 1.5,
    backgroundColor: COLORS.CREAM[0],
    borderRadius: 15,
    borderWidth: 5,
    marginBottom: GRID_GAP
    // width: "100%"
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
  noImages: {
    alignSelf: "center",
    height: "100%",
    width: "80%"
  },
  noImagesText: {
    fontSize: 40,
    textAlign: "center"
  },
  noImagesWrapper: {
    alignSelf: "center",
    // backgroundColor: "pink",
    height: "60%",
    width: "100%"
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
    backgroundColor: COLORS.CREAM[0],
    borderRadius: 8,
    borderWidth: 2,
    marginBottom: GRID_GAP
  },
  thumbnailRow: {
    gap: GRID_GAP
  }
});
