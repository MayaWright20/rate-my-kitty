import { useFonts } from "@expo-google-fonts/lilita-one";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, TextProps, View } from "react-native";

const purpleSparcle = require("../../assets/images/sparcles/sparcle-purple.png");

type Props = TextProps & {
  font: any;
  header?: boolean;
  subheading?: string;
};

export default function CustomFont({
  children,
  font,
  header,
  style,
  subheading,
  ...props
}: Props) {
  const [fontLoaded] = useFonts({
    fontFamily: font
  });

  const text = (
    <Text
      {...props}
      style={[
        fontLoaded ? { fontFamily: "fontFamily" } : styles.defaultFont,
        header ? styles.title : undefined,
        style
      ]}
    >
      {children}
    </Text>
  );

  if (!header) {
    return text;
  }

  return (
    <>
      <View style={styles.container}>
        <Image source={purpleSparcle} style={styles.image} />
        {text}
        <Image
          source={purpleSparcle}
          style={[styles.image, styles.imageTrailing]}
        />
      </View>
      {subheading && <Text style={styles.subheading}>{subheading}</Text>}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    flexDirection: "row"
  },
  defaultFont: {
    fontWeight: "bold"
  },
  image: {
    aspectRatio: 1,
    maxWidth: "20%",
    transform: [{ rotate: "190deg" }]
  },
  imageTrailing: {
    transform: [{ rotate: "10deg" }]
  },
  subheading: {
    fontWeight: "semibold",
    marginTop: 12,
    textAlign: "center"
  },
  title: {
    fontSize: 40,
    textAlign: "center",
    textTransform: "capitalize"
  }
});
