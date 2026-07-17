import { LilitaOne_400Regular } from "@expo-google-fonts/lilita-one";
import { render, screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import CustomFont from "../title-header";

test("should render styles.title if header is true", async () => {
  await render(
    <CustomFont header font={LilitaOne_400Regular}>
      textGoesHere
    </CustomFont>
  );

  const customFontText = screen.getByTestId("custom-font-text");
  const flatStyle = StyleSheet.flatten(customFontText.props.style);

  expect(flatStyle).toEqual({
    fontFamily: "fontFamily",
    fontSize: 40,
    textAlign: "center",
    textTransform: "capitalize"
  });
});

test("should render subheading if subheading is provided and header is true", async () => {
  await render(
    <CustomFont
      header={true}
      subheading="subheading"
      font={LilitaOne_400Regular}
    >
      textGoesHere
    </CustomFont>
  );

  const subheading = screen.getByTestId("custom-font-subheading");

  expect(subheading).toBeOnTheScreen();
});

test("should render children text content", async () => {
  await render(
    <CustomFont font={LilitaOne_400Regular}>Hello World</CustomFont>
  );

  expect(screen.getByText("Hello World")).toBeOnTheScreen();
});
