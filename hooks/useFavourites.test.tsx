import { renderHook } from "@testing-library/react-native";

import {
  FavouritesContext,
  FavouritesContextType
} from "@/context/favourites-context";

import useFavourites from "./useFavourites";

function RenderWithContext({
  children,
  value
}: {
  children: React.ReactNode;
  value: FavouritesContextType;
}) {
  return (
    <FavouritesContext.Provider value={value}>
      {children}
    </FavouritesContext.Provider>
  );
}

test("should throw a new error when there favourites context is null", async () => {
  const mockContext = null;

  jest.spyOn(console, "error").mockImplementation(() => {});

  await expect(
    renderHook(() => useFavourites(), {
      wrapper: ({ children }) => (
        <RenderWithContext value={mockContext}>{children}</RenderWithContext>
      )
    })
  ).rejects.toThrow("useFavourites must be used inside FavouritesContext");

  jest.restoreAllMocks();
});

test("should return favourite when favourite context is present", async () => {
  const mockContext = {
    errorMessage: "",
    favouriteImageIds: { "": true },
    favouriteImages: [
      {
        id: "",
        url: "",
        width: 4,
        height: 4,
        mime_type: "",
        entities: [""],
        breeds: [
          {
            id: 1,
            name: "",
            wikipedia_url: ""
          }
        ],
        animals: [""],
        categories: [""]
      }
    ],
    favouriteImagesById: { "": true },
    favouriteLoadingImageIds: { "": true },
    isLoading: false,
    loadFavouriteImageIds: jest.fn(),
    loadFavouriteImages: jest.fn(),
    toggleFavourite: jest.fn()
  };

  const { result } = await renderHook(() => useFavourites(), {
    wrapper: ({ children }) => (
      <RenderWithContext value={mockContext}>{children}</RenderWithContext>
    )
  });

  expect(result.current).toEqual(mockContext);
});
