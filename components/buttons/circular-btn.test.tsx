import { render, screen, userEvent } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import CircularBTN from "./circular-btn";

test("should render the title when provided", async () => {
  await render(<CircularBTN title="VOTE" />);

  expect(await screen.findByText("VOTE")).toBeOnTheScreen();
});

test("should render without crashing when no props are provided", async () => {
  await render(<CircularBTN />);

  expect(screen.getByTestId("circular-btn")).toBeOnTheScreen();
});

test("should render with custom title color if titleColor prop provided", async () => {
  await render(<CircularBTN title="VOTE" titleColor={"pink"} />);

  const title = screen.getByText("VOTE");
  const flatStyle = StyleSheet.flatten(title.props.style);

  expect(flatStyle.color).toBe("pink");
});

test("should render with default title color if titleColor prop is not provided", async () => {
  await render(<CircularBTN title="VOTE" />);

  const title = screen.getByText("VOTE");
  const flatStyle = StyleSheet.flatten(title.props.style);

  expect(flatStyle.color).toBe("#4B4B57");
});

test("should render with default title color if titleColor prop is undefined", async () => {
  await render(<CircularBTN title="VOTE" titleColor={undefined} />);

  const title = screen.getByText("VOTE");
  const flatStyle = StyleSheet.flatten(title.props.style);

  expect(flatStyle.color).toBe("#4B4B57");
});

test("should render with an icon if icon is provided", async () => {
  await render(
    <CircularBTN icon={{ name: "heart", size: 24, color: "red" }} />
  );

  const icon = screen.getByTestId("circular-btn-icon-wrapper");

  expect(icon).toBeOnTheScreen();
});

test("should render with custom background color if backgroundColor prop provided", async () => {
  await render(<CircularBTN title="VOTE" backgroundColor={"blue"} />);

  const iconWrapper = screen.getByTestId("circular-btn-icon-wrapper");
  const flatStyle = StyleSheet.flatten(iconWrapper.props.style);

  expect(flatStyle.backgroundColor).toBe("blue");
});

test("should call onPress when the button is pressed", async () => {
  const mockFn = jest.fn();

  await render(<CircularBTN onPress={mockFn} />);

  const circleBtn = screen.getByTestId("circular-btn"); // cant get id until the component is rendered await render(<CircularBTN onPress={mockFn} />);

  const user = userEvent.setup();
  await user.press(circleBtn);

  expect(mockFn).toHaveBeenCalled();
});
