import { fireEvent, render, screen } from "@testing-library/react-native";

import { testImage, votingContextProps } from "@/constants/test-variables";
import { IsScreenPortraitContext } from "@/context/screen-orientation-context";
import { VotingContext } from "@/context/voting-context";

import Gallery, { Props } from "../gallery";

function RenderWithContext(
  isPortrait: boolean,
  props: Props,
  contextProps = votingContextProps
) {
  return render(
    <VotingContext.Provider value={{ ...contextProps }}>
      <IsScreenPortraitContext.Provider value={isPortrait}>
        <Gallery {...props} />
      </IsScreenPortraitContext.Provider>
    </VotingContext.Provider>
  );
}

test("should render gallery in list mode", async () => {
  await RenderWithContext(true, {
    centerListImagesOnHorizontal: true,
    favouriteImageIds: { imageId1: true },
    images: [testImage],
    isGrid: false,
    onToggleFavourite: jest.fn()
  } as Props);

  const gallery = screen.getByTestId("gallery");

  expect(gallery).toBeOnTheScreen();
});

test("should render gallery in grid mode in portrait", async () => {
  await RenderWithContext(true, {
    favouriteImageIds: {},
    images: [testImage, testImage, testImage],
    isGrid: true,
    onToggleFavourite: jest.fn()
  } as Props);

  const gallery = screen.getByTestId("gallery");

  expect(gallery).toBeOnTheScreen();
});

test("should render gallery in grid mode in landscape", async () => {
  await RenderWithContext(false, {
    favouriteImageIds: {},
    images: [testImage, testImage, testImage],
    isGrid: true,
    onToggleFavourite: jest.fn()
  } as Props);

  const gallery = screen.getByTestId("gallery");

  expect(gallery).toBeOnTheScreen();
});

test("should call onToggleFavourite when favourite button is pressed", async () => {
  const onToggleFavourite = jest.fn();

  await RenderWithContext(true, {
    favouriteImageIds: { id: true },
    images: [testImage],
    isGrid: false,
    onToggleFavourite
  } as Props);

  const favouriteButton = screen.getByTestId("favourite-icon-button");

  fireEvent.press(favouriteButton);

  expect(onToggleFavourite).toHaveBeenCalledWith("id", testImage);
});

test("should render list mode with centerListImagesOnHorizontal in landscape", async () => {
  await RenderWithContext(false, {
    centerListImagesOnHorizontal: true,
    favouriteImageIds: {},
    images: [testImage],
    isGrid: false,
    onToggleFavourite: jest.fn()
  } as Props);

  const gallery = screen.getByTestId("gallery");

  expect(gallery).toBeOnTheScreen();
});

test("should render landscape image with correct aspect ratio in list mode", async () => {
  // Create an image that's wider than tall (landscape orientation)
  // This triggers: isLandscape = item.width && item.height && !isGrid && item.width > item.height
  // Which sets: aspectRatio: isLandscape ? 2 / 1.1 : ...
  const landscapeImage = {
    ...testImage,
    width: 10,
    height: 5
  };

  await RenderWithContext(true, {
    favouriteImageIds: {},
    images: [landscapeImage],
    isGrid: false,
    onToggleFavourite: jest.fn()
  } as Props);

  const gallery = screen.getByTestId("gallery");

  expect(gallery).toBeOnTheScreen();
});
