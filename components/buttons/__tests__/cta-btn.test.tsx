import { render, screen, userEvent } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import { IsScreenPortraitContext } from "@/context/screen-orientation-context";

import CTA_BTN from "../cta-btn";

function renderWithContext(ui: React.ReactElement, isPortrait: boolean) {
  return render(
    <IsScreenPortraitContext.Provider value={isPortrait}>
      {ui}
    </IsScreenPortraitContext.Provider>
  );
}

test("should render the title when provided", async () => {
  const mockFn = jest.fn();
  await render(<CTA_BTN title="title" onPress={mockFn} />);

  expect(await screen.findByText("title")).toBeOnTheScreen();
});

test("should render the icon when provided", async () => {
  const mockFn = jest.fn();
  await render(
    <CTA_BTN
      title="title"
      icon={{
        name: "search",
        size: 54,
        color: "pink"
      }}
      onPress={mockFn}
    />
  );

  const icon = screen.getByTestId("cta-btn-icon");

  expect(icon).toBeOnTheScreen();
});

test("should not render the icon when ifon is not provided", async () => {
  const mockFn = jest.fn();
  await render(<CTA_BTN title="title" onPress={mockFn} />);

  const icon = screen.queryByTestId("cta-btn-icon");

  expect(icon).not.toBeOnTheScreen();
});

test("should call onPress when pressed", async () => {
  const mockFn = jest.fn();
  await render(<CTA_BTN title="title" onPress={mockFn} />);

  const ctaBtn = screen.getByTestId("cta-btn");

  const user = userEvent.setup();
  await user.press(ctaBtn);

  expect(mockFn).toHaveBeenCalled();
});

test("should not call onPress if isDisabled is true", async () => {
  const mockFn = jest.fn();
  await render(<CTA_BTN title="title" onPress={mockFn} isDisabled />);

  const ctaBtn = screen.getByTestId("cta-btn");

  const user = userEvent.setup();
  await user.press(ctaBtn);

  expect(mockFn).not.toHaveBeenCalled();
});

test("should use 40% width when in isPortraitContext is false", async () => {
  const mockFn = jest.fn();
  await renderWithContext(<CTA_BTN title="title" onPress={mockFn} />, false);

  const ctaBtn = screen.getByTestId("cta-btn");
  const flatStyle = StyleSheet.flatten(ctaBtn.props.style);

  expect(flatStyle.maxWidth).toBe("40%");
});

test("should use undefined width when in isPortraitContext is true", async () => {
  const mockFn = jest.fn();
  await renderWithContext(<CTA_BTN title="title" onPress={mockFn} />, true);

  const ctaBtn = screen.getByTestId("cta-btn");
  const flatStyle = StyleSheet.flatten(ctaBtn.props.style);

  expect(flatStyle.maxWidth).toBe(undefined);
});
