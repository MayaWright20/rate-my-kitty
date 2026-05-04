import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";
import { CustomFont } from "../fonts/custom-fonts";

const purpleSparcle = require("../../assets/images/sparcles/sparcle-purple.png");

interface Props {
  title: string;
  font: any;
  subheading?: string;
}

export default function TitleHeader({ title, font, subheading }: Props) {
  return (
    <>
      <View style={styles.container}>
        <Image source={purpleSparcle} style={styles.image} />
        <CustomFont font={font} style={styles.title}>
          {title}
        </CustomFont>
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
    flexDirection: "row",
  },
  title: {
    fontSize: 40,
    textAlign: "center",
    textTransform: "capitalize",
  },
  image: {
    maxWidth: "20%",
    aspectRatio: 1,
    transform: [{ rotate: "190deg" }],
  },
  imageTrailing: {
    transform: [{ rotate: "10deg" }],
  },
  subheading: {
    marginTop: 12,
    fontWeight: "semibold",
    textTransform: "capitalize",
  },
});
