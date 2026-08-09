import { useQuery } from "@tanstack/react-query";

import getUploadedImages from "@/api/api";

export default function useProfile() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["profile-images"], // the shelf label
    queryFn: getUploadedImages // the store trip (our existing API function)
  });

  // We keep this small helper because our API can reject with a non-Error value.
  const errorMessage =
    error instanceof Error
      ? error.message
      : error
        ? "Failed to fetch profile images"
        : null;

  return {
    images: data ?? [], // same property name the screen already uses
    errorMessage,
    isLoading
  };
}
