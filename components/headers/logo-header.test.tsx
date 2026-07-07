import { render, screen } from "@testing-library/react-native";

import LogoHeader from "./logo-header";

test("should render LogoHeader", async () => {
  await render(<LogoHeader />);

  const logoHeader = screen.getByTestId("logo-header");

  expect(logoHeader).toBeOnTheScreen();
});
