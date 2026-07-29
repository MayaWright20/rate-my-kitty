import { act, renderHook } from "@testing-library/react-native";

import getUploadedImages, {
  getFavourites,
  toggleFavouriteItem
} from "@/api/api";

import { useFavouritesProviderValue } from "../favourites-context";

jest.mock("@/api/api", () => ({
  __esModule: true,
  default: jest.fn(),
  getFavourites: jest.fn(),
  toggleFavouriteItem: jest.fn()
}));

const mockFavourite = {
  id: 1,
  image_id: "cat-1",
  sub_id: "sub-1",
  created_at: "2024-01-01",
  image: {
    id: "cat-1",
    url: "https://example.com/cat1.jpg"
  }
};

const mockCatImage = {
  id: "cat-1",
  url: "https://example.com/cat1.jpg",
  width: 100,
  height: 100,
  mime_type: "image/jpeg",
  entities: [],
  breeds: [],
  animals: [],
  categories: []
};

// ============================================================
// INITIAL STATE
// ============================================================

test("should start with empty state", async () => {
  const { result } = await renderHook(() => useFavouritesProviderValue());

  expect(result.current.favouriteImageIds).toEqual({});
  expect(result.current.favouriteImages).toEqual([]);
  expect(result.current.favouriteImagesById).toEqual({});
  expect(result.current.favouriteLoadingImageIds).toEqual({});
  expect(result.current.isLoading).toBe(false);
  expect(result.current.errorMessage).toBeNull();
});

// ============================================================
// loadFavouriteImageIds
// ============================================================

test("should load favourite image IDs on success", async () => {
  (getFavourites as jest.Mock).mockResolvedValue([mockFavourite]);

  const { result } = await renderHook(() => useFavouritesProviderValue());

  await act(async () => {
    const ids = await result.current.loadFavouriteImageIds();
  });

  expect(result.current.favouriteImageIds).toEqual({ "cat-1": true });
  expect(result.current.errorMessage).toBeNull();
});

test("should store error message when loadFavouriteImageIds fails with an Error", async () => {
  (getFavourites as jest.Mock).mockRejectedValue(new Error("Network error"));

  const { result } = await renderHook(() => useFavouritesProviderValue());

  await act(async () => {
    const ids = await result.current.loadFavouriteImageIds();
  });

  expect(result.current.errorMessage).toBe("Network error");
  expect(result.current.favouriteImageIds).toEqual({});
});

test("should store fallback error message when loadFavouriteImageIds fails with a non-Error", async () => {
  (getFavourites as jest.Mock).mockRejectedValue("Something went wrong");

  const { result } = await renderHook(() => useFavouritesProviderValue());

  await act(async () => {
    const ids = await result.current.loadFavouriteImageIds();
  });

  expect(result.current.errorMessage).toBe("Failed to fetch favourites");
  expect(result.current.favouriteImageIds).toEqual({});
});

// ============================================================
// loadFavouriteImages
// ============================================================

test("should load favourite images on success", async () => {
  (getUploadedImages as jest.Mock).mockResolvedValue([mockCatImage]);
  (getFavourites as jest.Mock).mockResolvedValue([mockFavourite]);

  const { result } = await renderHook(() => useFavouritesProviderValue());

  await act(async () => {
    const images = await result.current.loadFavouriteImages();
  });

  expect(result.current.favouriteImageIds).toEqual({ "cat-1": true });
  expect(result.current.favouriteImages).toEqual([mockCatImage]);
  expect(result.current.isLoading).toBe(false);
  expect(result.current.errorMessage).toBeNull();
});

test("should store error message when loadFavouriteImages fails with an Error", async () => {
  (getUploadedImages as jest.Mock).mockRejectedValue(new Error("API error"));

  const { result } = await renderHook(() => useFavouritesProviderValue());

  await act(async () => {
    const images = await result.current.loadFavouriteImages();
  });

  expect(result.current.errorMessage).toBe("API error");
  expect(result.current.favouriteImages).toEqual([]);
  expect(result.current.isLoading).toBe(false);
});

test("should store fallback error message when loadFavouriteImages fails with a non-Error", async () => {
  (getUploadedImages as jest.Mock).mockRejectedValue("Oops");

  const { result } = await renderHook(() => useFavouritesProviderValue());

  await act(async () => {
    const images = await result.current.loadFavouriteImages();
  });

  expect(result.current.errorMessage).toBe("Failed to fetch favourites");
  expect(result.current.favouriteImages).toEqual([]);
  expect(result.current.isLoading).toBe(false);
});

// ============================================================
// toggleFavourite - Guard clause
// ============================================================

test("should not toggle when image is already loading", async () => {
  const { result } = await renderHook(() => useFavouritesProviderValue());

  // Manually set the loading state for this image
  result.current.favouriteLoadingImageIds["cat-1"] = true;

  await act(async () => {
    await result.current.toggleFavourite("cat-1");
  });

  // toggleFavouriteItem should NOT have been called
  expect(toggleFavouriteItem).not.toHaveBeenCalled();
});

// ============================================================
// toggleFavourite - Add favourite
// ============================================================

test("should add image to favourites when toggleFavourite succeeds and isFavourite is true", async () => {
  (toggleFavouriteItem as jest.Mock).mockResolvedValue({
    isFavourite: true
  });

  const { result } = await renderHook(() => useFavouritesProviderValue());

  await act(async () => {
    await result.current.toggleFavourite("cat-1", mockCatImage);
  });

  // The image ID should be marked as favourite
  expect(result.current.favouriteImageIds["cat-1"]).toBe(true);
  // The image should be in the favourite images list
  expect(result.current.favouriteImages).toContainEqual(mockCatImage);
  // Loading should be finished
  expect(result.current.favouriteLoadingImageIds["cat-1"]).toBe(false);
});

test("should not add duplicate image to favourites list", async () => {
  (toggleFavouriteItem as jest.Mock).mockResolvedValue({
    isFavourite: true
  });

  const { result } = await renderHook(() => useFavouritesProviderValue());

  // First toggle - add the image
  await act(async () => {
    await result.current.toggleFavourite("cat-1", mockCatImage);
  });

  // Second toggle - try to add the same image again
  await act(async () => {
    await result.current.toggleFavourite("cat-1", mockCatImage);
  });

  // The image should only appear once in the list
  expect(result.current.favouriteImages.length).toBe(1);
});

// ============================================================
// toggleFavourite - Remove favourite
// ============================================================

test("should remove image from favourites when toggleFavourite succeeds and isFavourite is false", async () => {
  // First call: add the favourite
  (toggleFavouriteItem as jest.Mock).mockResolvedValueOnce({
    isFavourite: true
  });

  const { result } = await renderHook(() => useFavouritesProviderValue());

  // Add the image to favourites
  await act(async () => {
    await result.current.toggleFavourite("cat-1", mockCatImage);
  });

  // Second call: remove the favourite
  (toggleFavouriteItem as jest.Mock).mockResolvedValueOnce({
    isFavourite: false
  });

  await act(async () => {
    await result.current.toggleFavourite("cat-1", mockCatImage);
  });

  // The image ID should NOT be marked as favourite
  expect(result.current.favouriteImageIds["cat-1"]).toBe(false);
  // The image should NOT be in the favourite images list
  expect(result.current.favouriteImages).not.toContainEqual(mockCatImage);
});

// ============================================================
// toggleFavourite - Error handling
// ============================================================

test("should store error message when toggleFavourite fails with an Error", async () => {
  (toggleFavouriteItem as jest.Mock).mockRejectedValue(
    new Error("Failed to update")
  );

  const { result } = await renderHook(() => useFavouritesProviderValue());

  await act(async () => {
    await result.current.toggleFavourite("cat-1");
  });

  expect(result.current.errorMessage).toBe("Failed to update");
  // Loading should be finished even after error
  expect(result.current.favouriteLoadingImageIds["cat-1"]).toBe(false);
});

test("should store fallback error message when toggleFavourite fails with a non-Error", async () => {
  (toggleFavouriteItem as jest.Mock).mockRejectedValue("Boom");

  const { result } = await renderHook(() => useFavouritesProviderValue());

  await act(async () => {
    await result.current.toggleFavourite("cat-1");
  });

  expect(result.current.errorMessage).toBe("Failed to update favourite");
  expect(result.current.favouriteLoadingImageIds["cat-1"]).toBe(false);
});

// ============================================================
// favouriteImagesById - Computed value
// ============================================================

test("should compute favouriteImagesById correctly when image is in both lists", async () => {
  (getUploadedImages as jest.Mock).mockResolvedValue([mockCatImage]);
  (getFavourites as jest.Mock).mockResolvedValue([mockFavourite]);

  const { result } = await renderHook(() => useFavouritesProviderValue());

  await act(async () => {
    await result.current.loadFavouriteImages();
  });

  // favouriteImagesById should merge favouriteImageIds with favouriteImages
  // favouriteImageIds["cat-1"] is true, so ?? true is NOT triggered
  expect(result.current.favouriteImagesById["cat-1"]).toBe(true);
});

test("should compute favouriteImagesById with fallback when image is not in favouriteImageIds", async () => {
  // This test covers line 46: [image.id]: favouriteImageIds[image.id] ?? true
  // When favouriteImageIds[image.id] is undefined, ?? true kicks in

  // First, add an image to favouriteImages via toggleFavourite
  (toggleFavouriteItem as jest.Mock).mockResolvedValue({
    isFavourite: true
  });

  const { result } = await renderHook(() => useFavouritesProviderValue());

  await act(async () => {
    await result.current.toggleFavourite("cat-1", mockCatImage);
  });

  // Now the image is in favouriteImages but also in favouriteImageIds
  // We need to clear favouriteImageIds while keeping favouriteImages
  // We can do this by calling loadFavouriteImageIds which returns empty
  (getFavourites as jest.Mock).mockResolvedValue([]);

  await act(async () => {
    await result.current.loadFavouriteImageIds();
  });

  // Now favouriteImageIds is {} but favouriteImages still has the image
  // favouriteImagesById["cat-1"] should fall back to true via ?? true
  expect(result.current.favouriteImagesById["cat-1"]).toBe(true);
});
