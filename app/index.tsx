import { LilitaOne_400Regular } from "@expo-google-fonts/lilita-one";
import { Image } from "expo-image";
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
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
import CatImageCard from "@/components/images/cat-image-card";
import { COLORS } from "@/constants/colors";
import useProfile from "@/hooks/useProfile";
import { CatImage } from "@/types";

const noImages = require("../assets/images/backgrounds/boa-cat.png");

const GRID_GAP = 12;
const HORIZONTAL_PADDING = 16;

export default function Index() {
  const { getProfileImages, images, isLoading, errorMessage } = useProfile();
  const { width } = useWindowDimensions();

  const [isGrid, setIsGrid] = useState<boolean>(false);
  const [favouriteImageIds, setFavouriteImageIds] = useState<
    Record<string, boolean>
  >({});
  const [favouriteLoadingImageIds, setFavouriteLoadingImageIds] = useState<
    Record<string, boolean>
  >({});

  const listImages = images ?? [];
  const availableWidth = width - HORIZONTAL_PADDING * 2;
  const numColumns = useMemo(() => (isGrid ? 2 : 1), [isGrid]);
  const HEADER_CONTENT_OFFSET = useMemo(() => (isGrid ? 170 : 200), [isGrid]);
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

  const toggleFavourite = useCallback(
    async (imageId: string) => {
      if (favouriteLoadingImageIds[imageId]) {
        return;
      }

      setFavouriteLoadingImageIds((currentIds) => ({
        ...currentIds,
        [imageId]: true
      }));

      try {
        const result = await toggleFavouriteItem(imageId);
        setFavouriteImageIds((currentFavouriteImageIds) => ({
          ...currentFavouriteImageIds,
          [imageId]: result.isFavourite
        }));
      } catch (e) {
        console.error(e);
      } finally {
        setFavouriteLoadingImageIds((currentIds) => ({
          ...currentIds,
          [imageId]: false
        }));
      }
    },
    [favouriteLoadingImageIds]
  );

  const renderImage = ({ item }: { item: CatImage }) => {
    const isLandscape =
      item.width && item.height && !isGrid && item.width > item.height;
    return (
      <CatImageCard
        image={item}
        contentFit="cover"
        contentPosition="center"
        favouriteButton={{
          accessibilityLabel: favouriteImageIds[item.id]
            ? "Unfavourite image"
            : "Favourite image",
          disabled: !!favouriteLoadingImageIds[item.id],
          isFavourite: !!favouriteImageIds[item.id],
          onPress: () => toggleFavourite(item.id),
          size: isGrid ? "small" : "large"
        }}
        imageStyle={[
          isGrid ? styles.thumbnailImage : styles.largeListImage,
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
