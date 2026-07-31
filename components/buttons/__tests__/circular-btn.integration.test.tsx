import { render, renderHook, screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import { IsScreenPortraitContext } from "@/context/screen-orientation-context";
import useIsScreenPortrait from "@/hooks/useIsScreenPortrait";

import CircularBTN, {
  HORIZONAL_SCREEN_WIDTH,
  PORTRAIT_SCREEN_WIDTH
} from "../circular-btn";

// Mock the specific module that provides useWindowDimensions.
// We mock the deep module path (not the whole react-native package) to avoid
// triggering native module loading that breaks in Jest.
jest.mock("react-native/Libraries/Utilities/useWindowDimensions", () => ({
  __esModule: true,
  default: jest.fn()
}));

// Helper to set the screen dimensions for a test.
// We use jest.requireMock to grab the mocked useWindowDimensions without
// importing the deep module path (which has no type declarations).
const setScreenDimensions = (height: number, width: number) => {
  const { default: useWindowDimensions } = jest.requireMock(
    "react-native/Libraries/Utilities/useWindowDimensions"
  );
  useWindowDimensions.mockReturnValue({ height, width });
};

test("renders PORTRAIT width when screen is portrait (height > width)", async () => {
  setScreenDimensions(800, 400); // portrait

  const { result: providerResult } = await renderHook(() =>
    useIsScreenPortrait()
  );

  await render(
    <IsScreenPortraitContext.Provider value={providerResult.current}>
      <CircularBTN />
    </IsScreenPortraitContext.Provider>
  );

  const circularBtnIconWrapper = screen.getByTestId(
    "circular-btn-icon-wrapper"
  );
  const circularBtnIconWrapperStyle = StyleSheet.flatten(
    circularBtnIconWrapper.props.style
  );

  expect(circularBtnIconWrapperStyle.width).toBe(PORTRAIT_SCREEN_WIDTH);
});

test("renders HORIZONTAL width when screen is landscape (width > height)", async () => {
  setScreenDimensions(400, 800); // landscape

  const { result: providerResult } = await renderHook(() =>
    useIsScreenPortrait()
  );

  await render(
    <IsScreenPortraitContext.Provider value={providerResult.current}>
      <CircularBTN />
    </IsScreenPortraitContext.Provider>
  );

  const circularBtnIconWrapper = screen.getByTestId(
    "circular-btn-icon-wrapper"
  );
  const circularBtnIconWrapperStyle = StyleSheet.flatten(
    circularBtnIconWrapper.props.style
  );

  expect(circularBtnIconWrapperStyle.width).toBe(HORIZONAL_SCREEN_WIDTH);
});
