import { useFonts } from "@expo-google-fonts/lilita-one";
import React from "react";
import { StyleSheet, Text, TextProps } from "react-native";

type CustomFontProps = TextProps & {
  font: any;
};

export function CustomFont({ font, style, ...props }: CustomFontProps) {
  const [fontLoaded] = useFonts({
    fontFamily: font
  });

  if (!fontLoaded) {
    return <Text {...props} style={[styles.defaultFont, style]} />;
  }

  return <Text {...props} style={[{ fontFamily: "fontFamily" }, style]} />;
}

const styles = StyleSheet.create({
  defaultFont: {
    fontWeight: "bold"
  }
});
