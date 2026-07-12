import { Image } from "expo-image";

import { CatImage } from "@/types";

export const hasImageUrls = (images: Pick<CatImage, "url">[]) => {
  const imageUrls = images
    .map((image) => image.url)
    .filter((url): url is string => Boolean(url));

  if (imageUrls.length !== 0) {
    return imageUrls;
  }
};

export const prefetchCatImages = async (images: Pick<CatImage, "url">[]) => {
  const imageUrls = hasImageUrls(images);

  if (imageUrls)
    try {
      await Image.prefetch(imageUrls, { cachePolicy: "memory-disk" });
    } catch {}
};
