import { LilitaOne_400Regular } from "@expo-google-fonts/lilita-one";
import { SharedRef } from "expo";
import { Image, ImageSource } from "expo-image";
import { StyleSheet, View } from "react-native";

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
  return (
    <View style={styles.noImagesPlaceholderWrapper}>
      <Image
        source={source ? source : defaultPlaceholder}
        style={styles.noImagesPlaceholder}
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
    alignSelf: "center",
    height: "100%",
    width: "80%"
  },
  noImagesPlaceholderWrapper: {
    alignSelf: "center",
    height: "60%",
    width: "100%"
  }
});
