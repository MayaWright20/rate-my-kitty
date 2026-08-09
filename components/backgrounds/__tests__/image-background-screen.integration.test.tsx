import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react-native";
import { ReactNode } from "react";
import { StyleSheet } from "react-native";

import Index from "@/app/index";
import {
  FavouritesContext,
  useFavouritesProviderValue
} from "@/context/favourites-context";
import { IsScreenPortraitContext } from "@/context/screen-orientation-context";

// Mock expo-image - it's a native module that doesn't render in Jest
jest.mock("expo-image", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    Image: (props: any) => React.createElement(View, props)
  };
});

// Mock react-native-svg - it's a native module that doesn't render in Jest
jest.mock("react-native-svg", () => {
  const React = require("react");
  const { View } = require("react-native");
  const MockComponent = (props: any) => React.createElement(View, props);
  return {
    __esModule: true,
    default: MockComponent,
    Svg: MockComponent,
    Defs: MockComponent,
    LinearGradient: MockComponent,
    Path: MockComponent,
    Stop: MockComponent
  };
});

// Mock expo-router - it's a native module that doesn't work in Jest
// useFocusEffect is a no-op so no state updates happen during render
jest.mock("expo-router", () => ({
  useFocusEffect: () => {}
}));

// Mock the API - we don't want real network calls
jest.mock("@/api/api", () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue([])
}));

// The Index screen now uses useProfile -> useQuery, which needs a pantry
// (QueryClientProvider). Create ONE for all tests, just like the app's root
// layout. retry:false = no retries for failed queries; gcTime: Infinity = no
// cache-cleanup timers, so Jest can exit cleanly.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, gcTime: Infinity, staleTime: Infinity }
  }
});

// A wrapper component that provides the contexts the Index screen needs.
// Hooks (like useFavouritesProviderValue) can only be called inside a component.
function TestWrapper({ children }: { children: ReactNode }) {
  const favourites = useFavouritesProviderValue();

  return (
    <QueryClientProvider client={queryClient}>
      <IsScreenPortraitContext.Provider value={true}>
        <FavouritesContext.Provider value={favourites}>
          {children}
        </FavouritesContext.Provider>
      </IsScreenPortraitContext.Provider>
    </QueryClientProvider>
  );
}

test("should render behind index screen", async () => {
  // Pre-seed the pantry: put "no images" on the ["profile-images"] shelf
  // BEFORE the screen mounts. Combined with staleTime: Infinity above, the
  // query finds the shelf already stocked and never needs to fetch — so the
  // test is fast, deterministic, and doesn't trigger act() warnings.
  queryClient.setQueryData(["profile-images"], []);

  // Index already renders its own ImageBackgroundScreen internally,
  // so we just render Index directly.
  await render(
    <TestWrapper>
      <Index />
    </TestWrapper>
  );

  // The background image is what's actually "behind" everything
  const backgroundImage = screen.getByTestId("image-background-screen-image");
  const backgroundImageStyle = StyleSheet.flatten(backgroundImage.props.style);

  // The index header overlay
  const index = screen.getByTestId("index");
  const indexflatStyle = StyleSheet.flatten(index.props.style);

  // The background image should be behind the index header
  expect(backgroundImageStyle.zIndex ?? 0).toBeLessThan(
    indexflatStyle.zIndex ?? 0
  );
});
