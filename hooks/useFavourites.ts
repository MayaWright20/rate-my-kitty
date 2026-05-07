import { useContext } from "react";

import { FavouritesContext } from "@/context/favourites-context";

export default function useFavourites() {
  const favourites = useContext(FavouritesContext);

  if (!favourites) {
    throw new Error("useFavourites must be used inside FavouritesContext");
  }

  return favourites;
}
