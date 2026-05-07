import { LilitaOne_400Regular } from "@expo-google-fonts/lilita-one";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ImageBackgroundScreen from "@/components/backgrounds/image-background-screen";
import Gallery from "@/components/cards/gallery";
import CatPlaceholder from "@/components/cards/placeholder";
import CustomFont from "@/components/headers/title-header";
import CatLoader from "@/components/loaders/cat-loader";
import { COLORS } from "@/constants/colors";
import { MARGIN } from "@/constants/styles";
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
          <CatLoader />
        ) : (
          <Gallery
            images={favouriteImages}
            isGrid
            favouriteImageIds={favouriteImagesById}
            favouriteLoadingImageIds={favouriteLoadingImageIds}
            onToggleFavourite={toggleFavourite}
            contentContainerStyle={styles.listContent}
            listEmptyComponent={
              <View style={styles.emtyListWrapper}>
                <CatPlaceholder
                  title="No favourites yet!"
                  subheading="Tap the heart on a kitty to save it here."
                />
              </View>
            }
            listHeaderComponent={
              <>
                {isLoading && <CatLoader />}
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
  emtyListWrapper: {
    height: "100%",
    width: "100%"
  },
  errorMessage: {
    color: COLORS.RED[0],
    marginBottom: MARGIN.X_LARGE,
    textAlign: "center"
  },
  inlineLoader: {
    marginBottom: MARGIN.X_LARGE
  },
  listContent: {
    paddingBottom: 120,
    paddingTop: 24
  }
});
