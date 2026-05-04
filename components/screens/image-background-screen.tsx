import { SharedRef } from "expo";
import { ImageBackground, ImageSource } from "expo-image";
import React from "react";
import { StyleSheet } from "react-native";

const defaultAvatar = require("../../assets/images/background.png");

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
    <ImageBackground
      source={source ? source : defaultAvatar}
      style={styles.container}
    >
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
