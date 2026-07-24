import { render } from "@testing-library/react-native";

import CatPlaceholder from "../placeholder";

test("should render the CatPlacholder title", async () => {
  const title = "catTitle";
  const subheading = "catSubheading";

  const placeholder = await render(
    <CatPlaceholder title={title} subheading={subheading} />
  );

  const catTitle = placeholder.getByText(title);

  expect(catTitle).toBeOnTheScreen();
});

test("should render the CatPlacholder subheading component", async () => {
  const title = "catTitle";
  const subheading = "catSubheading";

  const placeholder = await render(
    <CatPlaceholder title={title} subheading={subheading} />
  );

  const catSubheading = placeholder.getByText(subheading);

  expect(catSubheading).toBeOnTheScreen();
});

test("should render the CatPlacholder source when source is provided", async () => {
  const title = "catTitle";
  const subheading = "catSubheading";
  const source = "source";
  const catPlaceholderImage = "cat-placeholder-image";

  const placeholder = await render(
    <CatPlaceholder title={title} subheading={subheading} source={source} />
  );

  const catPlaceholderImageSource =
    placeholder.getByTestId(catPlaceholderImage);

  expect(catPlaceholderImageSource.props.source).toEqual([{ uri: source }]);
});
