import { render, screen, userEvent } from "@testing-library/react-native";
import * as React from "react";
import { StyleSheet } from "react-native";

import FavouriteIconButton from "../favourite-icon-btn";

test("should call onPress when pressed", async () => {
  const mockFn = jest.fn();
  await render(<FavouriteIconButton isFavourite={true} onPress={mockFn} />);

  const favouriteIconButton = screen.getByTestId("favourite-icon-button");

  const user = userEvent.setup();
  await user.press(favouriteIconButton);

  expect(mockFn).toHaveBeenCalled();
});

test("should have 'Unfavourite cat' as accessibility label if isFavourite is true", async () => {
  const mockFn = jest.fn();
  await render(<FavouriteIconButton isFavourite={true} onPress={mockFn} />);

  const favouriteIcon = screen.getByTestId("favourite-icon-button");
  const accessibilityLabel = favouriteIcon.props.accessibilityLabel;

  expect(accessibilityLabel).toBe("Unfavourite cat");
});

test("should have 'Favourite cat' as accessibility label if isFavourite is false", async () => {
  const mockFn = jest.fn();
  await render(<FavouriteIconButton isFavourite={false} onPress={mockFn} />);

  const favouriteIcon = screen.getByTestId("favourite-icon-button");
  const accessibilityLabel = favouriteIcon.props.accessibilityLabel;

  expect(accessibilityLabel).toBe("Favourite cat");
});

test("should have favouriteButtonLarge styles if size is large", async () => {
  const mockFn = jest.fn();
  await render(
    <FavouriteIconButton isFavourite={false} size="large" onPress={mockFn} />
  );

  const favouriteIcon = screen.getByTestId("favourite-icon-button");
  const flatStyle = StyleSheet.flatten(favouriteIcon.props.style);

  expect(flatStyle).toEqual({
    alignItems: "center",
    height: 58,
    justifyContent: "center",
    left: 14,
    position: "absolute",
    top: 14,
    width: 58,
    zIndex: 5
  });
});
