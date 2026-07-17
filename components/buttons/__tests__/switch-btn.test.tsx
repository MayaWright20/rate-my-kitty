import { render, screen, userEvent } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import { SwitchBTN } from "../switch-btn";

test("should render catloader", async () => {
  const mockFn = jest.fn();
  await render(<SwitchBTN value={true} onChange={mockFn} />);

  const result = screen.getByTestId("switch-btn");

  expect(result).toBeOnTheScreen();
});

test("should expect onChange to be called", async () => {
  const mockFn = jest.fn();
  await render(<SwitchBTN value={true} onChange={mockFn} />);

  const switchBtn = screen.getByTestId("switch-btn");
  const user = userEvent.setup();
  await user.press(switchBtn);

  expect(mockFn).toHaveBeenCalled();
});

test("should have activeLabel style on leftLabel when value is false", async () => {
  const mockFn = jest.fn();
  await render(<SwitchBTN value={false} onChange={mockFn} />);

  const switchBtn = screen.getByTestId("switch-btn-left-label");
  const flatStyle = StyleSheet.flatten(switchBtn.props.style);

  expect(flatStyle).toEqual({
    color: "#0D0B2D",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    textAlign: "center",
    width: 50
  });
});

test("should have props style and styles.switch when provided", async () => {
  const mockFn = jest.fn();
  await render(
    <SwitchBTN
      style={{ backgroundColor: "pink" }}
      value={false}
      onChange={mockFn}
    />
  );

  const switchBtn = screen.getByTestId("switch-btn");
  const flatStyle = StyleSheet.flatten(switchBtn.props.style);

  expect(flatStyle).toEqual({
    alignItems: "center",
    backgroundColor: "pink",
    borderColor: "#0D0B2D",
    borderRadius: 21,
    borderWidth: 2,
    height: 42,
    overflow: "hidden",
    padding: 4,
    width: 108
  });
});
