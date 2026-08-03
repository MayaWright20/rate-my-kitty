import { render, renderHook, screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import { IsScreenPortraitContext } from "@/context/screen-orientation-context";
import useIsScreenPortrait from "@/hooks/useIsScreenPortrait";

import CTA_BTN from "../cta-btn";

jest.mock("react-native/Libraries/Utilities/useWindowDimensions", () => ({
  __esModule: true,
  default: jest.fn()
}));

const setScreenDimensions = (height: number, width: number) => {
  const { default: useWindowDimensions } = jest.requireMock(
    "react-native/Libraries/Utilities/useWindowDimensions"
  );
  useWindowDimensions.mockReturnValue({ height, width });
};

test("should have maxWidth: 40% when isScreenPortrait context is false", async () => {
  setScreenDimensions(400, 800); // landscape

  const { result: providerResult } = await renderHook(() =>
    useIsScreenPortrait()
  );

  await render(
    <IsScreenPortraitContext.Provider value={providerResult.current}>
      <CTA_BTN title={"TITLE"} onPress={undefined} />
    </IsScreenPortraitContext.Provider>
  );

  const circularBtnIconWrapper = screen.getByTestId("cta-btn");
  const circularBtnIconWrapperStyle = StyleSheet.flatten(
    circularBtnIconWrapper.props.style
  );

  expect(circularBtnIconWrapperStyle.maxWidth).toBe("40%");
});

test("should not define maxWidth when isScreenPortrait context is true", async () => {
  setScreenDimensions(800, 500); // portrait

  const { result: providerResult } = await renderHook(() =>
    useIsScreenPortrait()
  );

  await render(
    <IsScreenPortraitContext.Provider value={providerResult.current}>
      <CTA_BTN title={"TITLE"} onPress={undefined} />
    </IsScreenPortraitContext.Provider>
  );

  const circularBtnIconWrapper = screen.getByTestId("cta-btn");
  const circularBtnIconWrapperStyle = StyleSheet.flatten(
    circularBtnIconWrapper.props.style
  );

  expect(circularBtnIconWrapperStyle.maxWidth).toBeUndefined();
});
