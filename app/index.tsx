import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import ImageBackgroundScreen from "@/components/backgrounds/image-background-screen";
import { SwitchBTN } from "@/components/buttons/switch-btn";
import Gallery from "@/components/cards/gallery";
import CatPlaceholder from "@/components/cards/placeholder";
import LogoHeader from "@/components/headers/logo-header";
import CatLoader from "@/components/loaders/cat-loader";
import { MARGIN, Z_INDEX } from "@/constants/styles";
import useFavourites from "@/hooks/useFavourites";
import useProfile from "@/hooks/useProfile";

export default function Index() {
  const { images, isLoading, errorMessage } = useProfile();
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
      loadFavouriteImageIds();
    }, [loadFavouriteImageIds])
  );

  return (
    <ImageBackgroundScreen>
      <View
        testID="index"
        pointerEvents="box-none"
        style={styles.headerOverlay}
      >
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
          <Gallery
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
  errorMessage: {
    textAlign: "center"
  },
  headerOverlay: {
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: Z_INDEX[1]
  },
  list: {
    flex: 1,
    zIndex: Z_INDEX[0]
  },
  listContent: {
    paddingBottom: 32
  },
  switch: {
    bottom: "35%",
    marginRight: MARGIN.MEDIUM,
    position: "absolute",
    right: 0,
    zIndex: Z_INDEX[5]
  }
});
