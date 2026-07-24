import { LilitaOne_400Regular } from "@expo-google-fonts/lilita-one";
import { SharedRef } from "expo";
import { Image, ImageSource } from "expo-image";
import { StyleSheet, useWindowDimensions, View } from "react-native";

import CustomFont from "../headers/title-header";

const DEFAULT_PLACEHOLDER = require("../../assets/images/backgrounds/boa-cat.png");

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

  return (
    <View style={styles.noImagesPlaceholderWrapper}>
      <Image
        testID="cat-placeholder-image"
        source={source ? source : DEFAULT_PLACEHOLDER}
        style={[
          styles.noImagesPlaceholder,
          { height: height / 2, width: width }
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
