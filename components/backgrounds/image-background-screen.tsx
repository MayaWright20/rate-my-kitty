import { SharedRef } from "expo";
import { Image, ImageSource } from "expo-image";
import React from "react";
import { StyleSheet, View } from "react-native";

const defaultBackground = require("../../assets/images/backgrounds/cream-patterned-background.png");

interface Props {
  children?: React.ReactNode;
  source?:
    | string
    | number
    | string[]
    | ImageSource
    | ImageSource[]
    | SharedRef<"image", Record<never, never>>
    | null
    | undefined;
}

export default function ImageBackgroundScreen({ children, source }: Props) {
  return (
    <View style={styles.container} testID="image-background-screen">
      <Image
        testID="image-background-screen-image"
        source={source ? source : defaultBackground}
        style={styles.background}
        contentFit="cover"
        pointerEvents="none"
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFill
  },
  container: {
    flex: 1
  }
});
