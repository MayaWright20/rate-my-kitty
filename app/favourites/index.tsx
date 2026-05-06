import { LilitaOne_400Regular } from "@expo-google-fonts/lilita-one";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ImageBackgroundScreen from "@/components/backgrounds/image-background-screen";
import CustomFont from "@/components/headers/title-header";
import CatImageGallery from "@/components/images/cat-image-gallery";
import { COLORS } from "@/constants/colors";
import useFavourites from "@/hooks/useFavourites";

export default function Index() {
  const {
    errorMessage,
    favouriteImages,
    favouriteImagesById,
    favouriteLoadingImageIds,
    isLoading,
    loadFavouriteImages,
    toggleFavourite
  } = useFavourites();

  useFocusEffect(
    useCallback(() => {
      loadFavouriteImages();
    }, [loadFavouriteImages])
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
