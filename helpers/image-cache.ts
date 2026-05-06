import { Image } from "expo-image";

import { CatImage } from "@/types";

export const prefetchCatImages = async (images: Pick<CatImage, "url">[]) => {
  const imageUrls = images
    .map((image) => image.url)
    .filter((url): url is string => Boolean(url));

  if (imageUrls.length === 0) {
    return;
  }

  try {
    await Image.prefetch(imageUrls, { cachePolicy: "memory-disk" });
  } catch {}
};
