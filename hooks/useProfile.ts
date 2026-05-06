import { useCallback, useState } from "react";

import getUploadedImages from "@/api/api";
import { prefetchCatImages } from "@/helpers/image-cache";
import { CatImage } from "@/types";

export default function useProfile() {
  const [images, setImages] = useState<[] | CatImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<null | string>(null);

  const getProfileImages = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const profileImages = await getUploadedImages();
      await prefetchCatImages(profileImages);
      setImages(profileImages);
      return profileImages;
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Failed to fetch profile images";
      setErrorMessage(message);
      setImages([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { images, isLoading, errorMessage, getProfileImages };
}
