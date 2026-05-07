import { createContext } from "react";

import { CatImage } from "@/types";

export type ToggleFavourite = (
  imageId: string,
  image?: CatImage
) => Promise<{ isFavourite: boolean } | void>;

export type FavouritesContextValue = {
  errorMessage: string | null;
  favouriteImageIds: Record<string, boolean>;
  favouriteImages: CatImage[];
  favouriteImagesById: Record<string, boolean>;
  favouriteLoadingImageIds: Record<string, boolean>;
  isLoading: boolean;
  loadFavouriteImageIds: () => Promise<Record<string, boolean>>;
  loadFavouriteImages: () => Promise<CatImage[]>;
  toggleFavourite: ToggleFavourite;
};

export const FavouritesContext = createContext<FavouritesContextValue | null>(
  null
);
