import { ImagePickerAsset } from "expo-image-picker";
import { useCallback, useMemo, useState } from "react";

import { uploadImage } from "@/api/api";

export default function useUploadImage() {
  const [image, setImage] = useState<ImagePickerAsset | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isUploading, setIsUploading] = useState(false);

  const isSubmitBtnDisabled = useMemo(
    () => !image || !!errorMessage || isUploading,
    [image, errorMessage, isUploading]
  );

  const onChangeImage = useCallback((value: ImagePickerAsset | null) => {
    setImage(value);
    setErrorMessage(undefined);
  }, []);

  const resetImage = useCallback(() => {
    onChangeImage(null);
  }, [onChangeImage]);

  const uploadSelectedImage = useCallback(async () => {
    if (!image) {
      return false;
    }

    setIsUploading(true);
    setErrorMessage(undefined);

    try {
      const result = await uploadImage({ file: image });

      if (typeof result === "object" && result && result.approved === 1) {
        resetImage();
        return true;
      }

      setErrorMessage(
        typeof result === "string" ? result : "Image upload failed"
      );
      return false;
    } catch (e) {
      const message = e instanceof Error ? e.message : "Image upload failed";
      setErrorMessage(message);
      return false;
    } finally {
      setIsUploading(false);
    }
  }, [image, resetImage]);

  return {
    errorMessage,
    image,
    isSubmitBtnDisabled,
    isUploading,
    onChangeImage,
    resetImage,
    uploadSelectedImage
  };
}
