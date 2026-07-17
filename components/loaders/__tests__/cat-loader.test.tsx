import { render, screen } from "@testing-library/react-native";

import CatLoader from "../cat-loader";

test("should render catloader", async () => {
  await render(<CatLoader />);

  const result = screen.getByTestId("cat-loader");

  expect(result).toBeOnTheScreen();
});
