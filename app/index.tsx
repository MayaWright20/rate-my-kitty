import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import ImageBackgroundScreen from "@/components/backgrounds/image-background-screen";
import { SwitchBTN } from "@/components/buttons/switch-btn";
import LogoHeader from "@/components/headers/logo-header";
import CatImageGallery from "@/components/images/cat-image-gallery";
import CatPlaceholder from "@/components/images/placeholder";
import CatLoader from "@/components/loaders/cat-loader";
import useFavourites from "@/hooks/useFavourites";
import useProfile from "@/hooks/useProfile";

export default function Index() {
  const { getProfileImages, images, isLoading, errorMessage } = useProfile();
  const {
    favouriteImageIds,
    favouriteLoadingImageIds,
    loadFavouriteImageIds,
    toggleFavourite
  } = useFavourites();

  const [isGrid, setIsGrid] = useState<boolean>(false);

  const listImages = images ?? [];
  const HEADER_CONTENT_OFFSET = useMemo(() => (isGrid ? 170 : 200), [isGrid]);

  useFocusEffect(
    useCallback(() => {
      const loadImagesAndFavourites = async () => {
        await Promise.all([getProfileImages(), loadFavouriteImageIds()]);
      };

      loadImagesAndFavourites();
    }, [getProfileImages, loadFavouriteImageIds])
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
        <CatLoader />
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
                {isLoading && <CatLoader />}
                {errorMessage && (
                  <Text style={styles.errorMessage}>{errorMessage}</Text>
                )}
              </>
            }
          />
        </>
      ) : (
        <CatPlaceholder
          title="No Kitties yet!"
          subheading="Go to the upload screen to get started!"
        />
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
  list: {
    flex: 1,
    zIndex: 1
  },
  listContent: {
    paddingBottom: 32
  },
  noImagesPlaceholder: {
    alignSelf: "center",
    height: "100%",
    width: "80%"
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
