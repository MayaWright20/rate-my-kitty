import { LilitaOne_400Regular } from "@expo-google-fonts/lilita-one";
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import getUploadedImages, {
  getFavourites,
  toggleFavouriteItem
} from "@/api/api";
import ImageBackgroundScreen from "@/components/backgrounds/image-background-screen";
import CustomFont from "@/components/headers/title-header";
import CatImageGallery from "@/components/images/cat-image-gallery";
import { COLORS } from "@/constants/colors";
import { CatImage } from "@/types";

export default function Index() {
  const [favouriteImages, setFavouriteImages] = useState<CatImage[]>([]);
  const [favouriteImageIds, setFavouriteImageIds] = useState<
    Record<string, boolean>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const [favouriteLoadingImageIds, setFavouriteLoadingImageIds] = useState<
    Record<string, boolean>
  >({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const favouriteImagesById = useMemo(
    () =>
      favouriteImages.reduce<Record<string, boolean>>(
        (favouriteIds, image) => ({
          ...favouriteIds,
          [image.id]: favouriteImageIds[image.id] ?? true
        }),
        {}
      ),
    [favouriteImageIds, favouriteImages]
  );

  const loadFavouriteImages = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const [uploadedImages, favourites] = await Promise.all([
        getUploadedImages(),
        getFavourites()
      ]);
      const nextFavouriteImageIds = favourites.reduce<Record<string, boolean>>(
        (favouriteIds, favourite) => ({
          ...favouriteIds,
          [favourite.image_id]: true
        }),
        {}
      );

      setFavouriteImageIds(nextFavouriteImageIds);
      setFavouriteImages(
        uploadedImages.filter((image) => nextFavouriteImageIds[image.id])
      );
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Failed to fetch favourites";
      setErrorMessage(message);
      setFavouriteImages([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadFavouriteImages();
    }, [loadFavouriteImages])
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
      setErrorMessage(null);

      try {
        const result = await toggleFavouriteItem(imageId);
        setFavouriteImageIds((currentFavouriteImageIds) => ({
          ...currentFavouriteImageIds,
          [imageId]: result.isFavourite
        }));

        if (!result.isFavourite) {
          setFavouriteImages((currentImages) =>
            currentImages.filter((image) => image.id !== imageId)
          );
        }
      } catch (e) {
        const message =
          e instanceof Error ? e.message : "Failed to update favourite";
        setErrorMessage(message);
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
    <ImageBackgroundScreen>
      <SafeAreaView edges={["top"]} style={styles.container}>
        <CustomFont header font={LilitaOne_400Regular}>
          Favourites
        </CustomFont>
        {isLoading && favouriteImages.length === 0 ? (
          <ActivityIndicator style={styles.loader} />
        ) : (
          <CatImageGallery
            images={favouriteImages}
            isGrid
            favouriteImageIds={favouriteImagesById}
            favouriteLoadingImageIds={favouriteLoadingImageIds}
            onToggleFavourite={toggleFavourite}
            contentContainerStyle={styles.listContent}
            listEmptyComponent={
              <View style={styles.emptyWrapper}>
                <Text style={styles.emptyTitle}>No favourites yet!</Text>
                <Text style={styles.emptyText}>
                  Tap the heart on a kitty to save it here.
                </Text>
              </View>
            }
            listHeaderComponent={
              <>
                {isLoading && <ActivityIndicator style={styles.inlineLoader} />}
                {errorMessage && (
                  <Text style={styles.errorMessage}>{errorMessage}</Text>
                )}
              </>
            }
          />
        )}
      </SafeAreaView>
    </ImageBackgroundScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  emptyText: {
    color: COLORS.BLACK[2],
    fontSize: 14,
    marginTop: 6,
    textAlign: "center"
  },
  emptyTitle: {
    color: COLORS.BLACK[3],
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center"
  },
  emptyWrapper: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 80
  },
  errorMessage: {
    color: COLORS.RED[0],
    marginBottom: 12,
    textAlign: "center"
  },
  inlineLoader: {
    marginBottom: 12
  },
  listContent: {
    paddingBottom: 120,
    paddingTop: 24
  },
  loader: {
    marginTop: 80
  }
});
