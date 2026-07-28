import { act, renderHook } from "@testing-library/react-native";

import getUploadedImages from "@/api/api";

import useProfile from "../useProfile";

// ✅ FIX 1: Mock the DEFAULT export, not a named export!
// The real api.ts does: export default async function getUploadedImages()
// So we need: { __esModule: true, default: jest.fn() }
jest.mock("@/api/api", () => ({
  __esModule: true,
  default: jest.fn()
}));

test("should fetch images and update state when getProfileImages succeeds", async () => {
  // Arrange: Set up the mock to return data
  const mockImages = [
    {
      id: "cat_123",
      url: "https://example.com/cat.jpg",
      width: 5,
      height: 5,
      mime_type: "image/jpeg",
      entities: ["cat"],
      breeds: [
        {
          id: 1,
          name: "Persian",
          wikipedia_url: "https://en.wikipedia.org/wiki/Persian_cat"
        }
      ],
      animals: ["cat"],
      categories: ["cute"]
    }
  ];
  (getUploadedImages as jest.Mock).mockResolvedValue(mockImages);

  // Act: Render the hook and call getProfileImages
  const { result } = await renderHook(() => useProfile());

  // ✅ FIX 2: Wait for the async operation
  await act(async () => {
    await result.current.getProfileImages();
  });

  // Assert: Check the state was updated correctly
  expect(result.current.images).toHaveLength(1);
  expect(result.current.images[0].id).toBe("cat_123");
  expect(result.current.isLoading).toBe(false);
  expect(result.current.errorMessage).toBeNull();
});

test("should handle error when getProfileImages fails", async () => {
  // Arrange: Make the mock reject
  (getUploadedImages as jest.Mock).mockRejectedValue(
    new Error("Network error")
  );

  // Act: Render the hook and call getProfileImages
  const { result } = await renderHook(() => useProfile());

  await act(async () => {
    await result.current.getProfileImages();
  });

  // Assert: Check error state
  expect(result.current.images).toHaveLength(0);
  expect(result.current.isLoading).toBe(false);
  expect(result.current.errorMessage).toBe("Network error");
});

test("should handle non-Error rejection (fallback message)", async () => {
  // Arrange: Mock rejects with a string (not an Error)
  (getUploadedImages as jest.Mock).mockRejectedValue("Something went wrong");

  // Act
  const { result } = await renderHook(() => useProfile());

  await act(async () => {
    await result.current.getProfileImages();
  });

  // Assert: Check the fallback error message
  expect(result.current.errorMessage).toBe("Failed to fetch profile images");
  expect(result.current.images).toHaveLength(0);
  expect(result.current.isLoading).toBe(false);
});
