import { useMemo } from "react";
import { useWindowDimensions } from "react-native";

export default function useIsScreenPortrait() {
  const { height, width } = useWindowDimensions();

  const isScreenPortrait = useMemo(() => height >= width, [height, width]);

  return isScreenPortrait;
}
