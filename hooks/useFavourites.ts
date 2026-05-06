import { useCallback, useMemo, useState } from "react";

import getUploadedImages, {
  getFavourites,
  toggleFavouriteItem
} from "@/api/api";
import { prefetchCatImages } from "@/helpers/image-cache";
import { CatImage } from "@/types";

export default function useFavourites() {
  const [favouriteImages, setFavouriteImages] = useState<CatImage[]>([]);
  const [favouriteImageIds, setFavouriteImageIds] = useState<
    Record<string, boolean>
  >({});
  const [favouriteLoadingImageIds, setFavouriteLoadingImageIds] = useState<
    Record<string, boolean>
  >({});
  const [isLoading, setIsLoading] = useState(false);
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

  const loadFavouriteImageIds = useCallback(async () => {
    setErrorMessage(null);

    try {
      const favourites = await getFavourites();
      const nextFavouriteImageIds = favourites.reduce<Record<string, boolean>>(
        (favouriteIds, favourite) => ({
          ...favouriteIds,
          [favourite.image_id]: true
        }),
        {}
      );

      setFavouriteImageIds(nextFavouriteImageIds);
      return nextFavouriteImageIds;
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Failed to fetch favourites";
      setErrorMessage(message);
      setFavouriteImageIds({});
      return {};
    }
  }, []);

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

      const nextFavouriteImages = uploadedImages.filter(
        (image) => nextFavouriteImageIds[image.id]
      );

      await prefetchCatImages(nextFavouriteImages);
      setFavouriteImageIds(nextFavouriteImageIds);
      setFavouriteImages(nextFavouriteImages);
      return uploadedImages;
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Failed to fetch favourites";
      setErrorMessage(message);
      setFavouriteImages([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

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

        return result;
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

  return {
    errorMessage,
    favouriteImageIds,
    favouriteImages,
    favouriteImagesById,
    favouriteLoadingImageIds,
    isLoading,
    loadFavouriteImageIds,
    loadFavouriteImages,
    toggleFavourite
  };
}
