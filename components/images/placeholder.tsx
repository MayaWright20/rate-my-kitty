import { LilitaOne_400Regular } from "@expo-google-fonts/lilita-one";
import { SharedRef } from "expo";
import { Image, ImageSource } from "expo-image";
import { StyleSheet, useWindowDimensions, View } from "react-native";

import CustomFont from "../headers/title-header";

const defaultPlaceholder = require("../../assets/images/backgrounds/boa-cat.png");

interface Props {
  source?:
    | string
    | number
    | string[]
    | ImageSource
    | ImageSource[]
    | SharedRef<"image", Record<never, never>>
    | null
    | undefined;
  title: string;
  subheading: string;
}

export default function CatPlaceholder({ source, title, subheading }: Props) {
  const { height, width } = useWindowDimensions();
  const imageHeight = Math.min(height * 0.42, 440);
  const imageWidth = Math.min(width * 0.72, imageHeight * (2 / 3));

  return (
    <View style={styles.noImagesPlaceholderWrapper}>
      <Image
        source={source ? source : defaultPlaceholder}
        style={[
          styles.noImagesPlaceholder,
          { height: imageHeight, width: imageWidth }
        ]}
        contentFit="contain"
        contentPosition="center"
      />
      <CustomFont header font={LilitaOne_400Regular} subheading={subheading}>
        {title}
      </CustomFont>
    </View>
  );
}

const styles = StyleSheet.create({
  noImagesPlaceholder: {
    alignSelf: "center"
  },
  noImagesPlaceholderWrapper: {
    alignItems: "center",
    alignSelf: "center",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    width: "100%"
  }
});
