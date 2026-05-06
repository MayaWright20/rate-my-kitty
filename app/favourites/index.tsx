import { LilitaOne_400Regular } from "@expo-google-fonts/lilita-one";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import getUploadedImages, {
  getFavourites,
  toggleFavouriteItem
} from "@/api/api";
import ImageBackgroundScreen from "@/components/backgrounds/image-background-screen";
import TitleHeader from "@/components/headers/title-header";
import { COLORS } from "@/constants/colors";
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
  const { width } = useWindowDimensions();
  const [favouriteImages, setFavouriteImages] = useState<CatImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [unfavouritingImageIds, setUnfavouritingImageIds] = useState<
    Record<string, boolean>
  >({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const imageWidth = (width - HORIZONTAL_PADDING * 2 - GRID_GAP) / 2;

  const loadFavouriteImages = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const favourites = await getFavourites();
      const needsUploadedImages = favourites.some(
        (favourite) => !favourite.image?.url
      );
      const uploadedImagesById = needsUploadedImages
        ? new Map((await getUploadedImages()).map((image) => [image.id, image]))
        : new Map<string, CatImage>();
      const images = favourites
        .map(
          (favourite) =>
            favourite.image ?? uploadedImagesById.get(favourite.image_id)
        )
        .filter((image): image is CatImage => !!image?.url);

      setFavouriteImages(images);
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

  const unfavouriteImage = useCallback(
    async (imageId: string) => {
      if (unfavouritingImageIds[imageId]) {
        return;
      }

      setUnfavouritingImageIds((currentIds) => ({
        ...currentIds,
        [imageId]: true
      }));
      setErrorMessage(null);

      try {
        await toggleFavouriteItem(imageId);
        setFavouriteImages((currentImages) =>
          currentImages.filter((image) => image.id !== imageId)
        );
      } catch (e) {
        const message =
          e instanceof Error ? e.message : "Failed to unfavourite image";
        setErrorMessage(message);
      } finally {
        setUnfavouritingImageIds((currentIds) => ({
          ...currentIds,
          [imageId]: false
        }));
      }
    },
    [unfavouritingImageIds]
  );

  const renderImage = ({ item }: { item: CatImage }) => (
    <View
      style={[
        styles.imageWrapper,
        {
          height: imageWidth,
          width: imageWidth
        }
      ]}
    >
      <Image
        contentFit="scale-down"
        source={{ uri: item.url }}
        style={[
          styles.image,
          {
            borderColor: getImageBorderColor(item.id)
          }
        ]}
      />
      <Pressable
        accessibilityLabel="Unfavourite image"
        accessibilityRole="button"
        disabled={!!unfavouritingImageIds[item.id]}
        onPress={() => unfavouriteImage(item.id)}
        style={styles.heartButton}
      >
        <Ionicons
          name="heart"
          color={COLORS.BLACK[3]}
          size={31}
          style={styles.heartOutline}
        />
        <Ionicons name="heart" color={COLORS.RED[0]} size={29} />
      </Pressable>
    </View>
  );

  return (
    <ImageBackgroundScreen>
      <SafeAreaView edges={["top"]} style={styles.container}>
        <TitleHeader title={"Favourites"} font={LilitaOne_400Regular} />
        {isLoading && favouriteImages.length === 0 ? (
          <ActivityIndicator style={styles.loader} />
        ) : (
          <FlatList
            data={favouriteImages}
            numColumns={2}
            keyExtractor={(item) => item.id}
            renderItem={renderImage}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyWrapper}>
                <Text style={styles.emptyTitle}>No favourites yet!</Text>
                <Text style={styles.emptyText}>
                  Tap the heart on a kitty to save it here.
                </Text>
              </View>
            }
            ListHeaderComponent={
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
  heartButton: {
    alignItems: "center",
    backgroundColor: COLORS.CREAM[0],
    borderColor: COLORS.WHITE[0],
    borderRadius: 20,
    borderWidth: 2,
    height: 38,
    justifyContent: "center",
    position: "absolute",
    right: 8,
    top: 8,
    width: 38
  },
  heartOutline: {
    position: "absolute"
  },
  image: {
    borderRadius: 8,
    borderWidth: 2,
    height: "100%",
    width: "100%"
  },
  imageWrapper: {
    marginBottom: GRID_GAP
  },
  inlineLoader: {
    marginBottom: 12
  },
  listContent: {
    paddingBottom: 120,
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 24
  },
  loader: {
    marginTop: 80
  },
  row: {
    gap: GRID_GAP
  }
});
