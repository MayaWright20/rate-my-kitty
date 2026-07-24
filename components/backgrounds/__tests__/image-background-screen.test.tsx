import { render } from "@testing-library/react-native";

import ImageBackgroundScreen from "../image-background-screen";

test("should render the image background screen component when provided", async () => {
  const imagesBackgroundScreen = await render(<ImageBackgroundScreen />);

  const item = imagesBackgroundScreen.getByTestId("image-background-screen");

  expect(item).toBeOnTheScreen();
});

test("should render the image background screen component with a the source provided if a source is provided", async () => {
  const dummySource = "dummySource";
  const imagesBackgroundScreen = await render(
    <ImageBackgroundScreen source={dummySource} />
  );

  const item = imagesBackgroundScreen.getByTestId(
    "image-background-screen-image"
  );

  const itemSource = item.props.source;

  expect(itemSource).toEqual([{ uri: dummySource }]);
});
