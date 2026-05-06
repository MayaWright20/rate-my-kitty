import {
  createContext,
  createElement,
  PropsWithChildren,
  useMemo
} from "react";
import { useWindowDimensions } from "react-native";

export const IsScreenPortraitContext = createContext<boolean | null>(null);

export function ScreenOrientationProvider({ children }: PropsWithChildren) {
  const { height, width } = useWindowDimensions();

  const value = useMemo(() => height >= width, [height, width]);

  return createElement(IsScreenPortraitContext.Provider, { value }, children);
}
