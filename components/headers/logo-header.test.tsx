import { render, screen } from "@testing-library/react-native";
import React from "react";
import { StyleSheet } from "react-native";

import { IsScreenPortraitContext } from "@/context/screen-orientation-context";

import LogoHeader from "./logo-header";

function RenderWithContext(ui: React.ReactElement, isPortrait: boolean) {
  return render(
    <IsScreenPortraitContext.Provider value={isPortrait}>
      {ui}
    </IsScreenPortraitContext.Provider>
  );
}

test("should render LogoHeader", async () => {
  await render(<LogoHeader />);

  const logoHeader = screen.getByTestId("logo-header");

  expect(logoHeader).toBeOnTheScreen();
});

test("should have IMAGE_PORTRAIT_WIDTH when isScreenPortraitContext is true", async () => {
  await RenderWithContext(<LogoHeader />, true);
  const logoHeaderPurpleSvg = screen.getByTestId("logo-header-purple-svg");
  const flatStyle = StyleSheet.flatten(logoHeaderPurpleSvg.props.style);

  expect(flatStyle.height).toBe(320);
});
