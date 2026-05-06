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
    <View style={styles.container}>
      <Image
        source={source ? source : defaultBackground}
        style={styles.background}
        contentFit="cover"
        pointerEvents="none"
      />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFillObject
  },
  container: {
    flex: 1
  },
  content: {
    flex: 1
  }
});
