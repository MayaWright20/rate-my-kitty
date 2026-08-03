// Mock expo-router so we can spy on router.push
// Then in the test:
import { act, renderHook } from "@testing-library/react-native";
import { router } from "expo-router";

import { uploadImage } from "@/api/api";

import useUploadImage from "../useUploadImage";

jest.mock("expo-router", () => ({
  router: { push: jest.fn() }
}));

// Mock the API - we don't want real network calls
jest.mock("@/api/api", () => ({
  uploadImage: jest.fn() // ← Named export, matching the import!
}));

test("should navigate home when upload succeeds with approved: 1", async () => {
  const mockImage = {
    uri: "uri",
    width: 5,
    height: 5
  };

  (uploadImage as jest.Mock).mockResolvedValue({ approved: 1 });

  const { result } = await renderHook(() => useUploadImage());

  await act(async () => {
    result.current.onChangeImage(mockImage);
  });
  await act(async () => {
    await result.current.uploadSelectedImage();
  });

  expect(router.push).toHaveBeenCalledWith("/");
});

jest.mock("expo-router", () => ({
  router: { push: jest.fn() }
}));

test("should navigate home when upload succeeds with approved: 1", async () => {
  // Mock the network layer - the REAL API uploadImage will use this
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify({ approved: 1 }))
    })
  ) as unknown as typeof fetch;

  const mockImage = { uri: "uri", width: 5, height: 5 };

  const { result } = await renderHook(() => useUploadImage());

  await act(async () => {
    result.current.onChangeImage(mockImage);
  });
  await act(async () => {
    await result.current.uploadSelectedImage();
  });

  expect(router.push).toHaveBeenCalledWith("/");
});
