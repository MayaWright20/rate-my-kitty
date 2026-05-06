import { LilitaOne_400Regular } from "@expo-google-fonts/lilita-one";
import { Image } from "expo-image";
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { getFavourites, toggleFavouriteItem } from "@/api/api";
import ImageBackgroundScreen from "@/components/backgrounds/image-background-screen";
import { SwitchBTN } from "@/components/buttons/switch-btn";
import LogoHeader from "@/components/headers/logo-header";
import CustomFont from "@/components/headers/title-header";
import CatImageGallery from "@/components/images/cat-image-gallery";
import useProfile from "@/hooks/useProfile";

const NO_IMAGES_PLACEHOLDER = require("../assets/images/backgrounds/boa-cat.png");

export default function Index() {
  const { getProfileImages, images, isLoading, errorMessage } = useProfile();

  const [isGrid, setIsGrid] = useState<boolean>(false);
  const [favouriteImageIds, setFavouriteImageIds] = useState<
    Record<string, boolean>
  >({});
  const [favouriteLoadingImageIds, setFavouriteLoadingImageIds] = useState<
    Record<string, boolean>
  >({});

  const listImages = images ?? [];
  const HEADER_CONTENT_OFFSET = useMemo(() => (isGrid ? 170 : 200), [isGrid]);

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
          <CatImageGallery
            centerListImagesOnHorizontal
            images={listImages}
            isGrid={isGrid}
            listStyle={styles.list}
            favouriteImageIds={favouriteImageIds}
            favouriteLoadingImageIds={favouriteLoadingImageIds}
            onToggleFavourite={toggleFavourite}
            contentContainerStyle={[
              styles.listContent,
              { paddingTop: HEADER_CONTENT_OFFSET }
            ]}
            listHeaderComponent={
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
        <View style={styles.noImagesPlaceholderWrapper}>
          <Image
            source={NO_IMAGES_PLACEHOLDER}
            style={styles.noImagesPlaceholder}
            contentFit="contain"
            contentPosition="center"
          />
          <CustomFont
            header
            font={LilitaOne_400Regular}
            subheading="Go to the upload screen to get started!"
          >
            No Kitties yet!
          </CustomFont>
        </View>
      )}
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
    justifyContent: "center"
  },
  initialLoader: {
    alignSelf: "center"
  },
  list: {
    flex: 1,
    zIndex: 1
  },
  listContent: {
    paddingBottom: 32
  },
  loader: {
    marginVertical: 16
  },
  noImagesPlaceholder: {
    alignSelf: "center",
    height: "100%",
    width: "80%"
  },
  noImagesPlaceholderText: {
    fontSize: 40,
    textAlign: "center"
  },
  noImagesPlaceholderWrapper: {
    alignSelf: "center",
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
  }
});
