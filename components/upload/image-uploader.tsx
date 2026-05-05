import { COLORS } from "@/constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

const defaultStar = require("../../assets/images/sparcles/star-purple.png");

export default function ImageUploader() {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "Permission to access the media library is required.",
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <>
      {/* <View> */}
      {image && (
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <Image source={{ uri: image }} style={styles.image} />
          <Image source={defaultStar} style={styles.star} />
          <Image
            source={defaultStar}
            style={[styles.star, styles.startTrailing]}
          />
        </View>
      )}
      {/* </View> */}
      <Pressable
        style={
          image
            ? [styles.container, styles.containerSmall]
            : [styles.container, styles.containerLarge]
        }
        onPress={pickImage}
      >
        <Ionicons
          style={[styles.icon, image && styles.iconSmall]}
          name={"camera"}
          color={COLORS.PURPLE[3]}
          size={image ? 50 : 70}
        />
        <View style={!image && styles.textWrapper}>
          <Text style={[styles.title, image && styles.titleSmall]}>
            {image ? "Edit photo" : "Tap to upload"}
          </Text>
          <Text style={[styles.label, image && styles.labelSmall]}>
            {"Pick your best cat picture!"}
          </Text>
        </View>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    borderStyle: "dotted",
    borderWidth: 5,
    margin: 15,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  containerSmall: {
    backgroundColor: COLORS.CREAM[0],
    borderColor: COLORS.CREAM[3],
    flexDirection: "row",
    aspectRatio: 2 / 0.5,
  },
  containerLarge: {
    width: "90%",
    borderColor: COLORS.PURPLE[1],
    backgroundColor: COLORS.PURPLE[0],
    aspectRatio: 2 / 1.5,
  },
  icon: {
    marginBottom: 5,
  },
  iconSmall: {
    marginRight: 15,
    color: COLORS.CREAM[3],
  },
  title: {
    fontWeight: "bold",
  },
  titleLarge: {
    fontSize: 25,
    marginBottom: 15,
    color: COLORS.PURPLE[3],
  },
  label: {
    color: COLORS.BLACK[3],
  },
  labelSmall: {
    color: COLORS.CREAM[3],
    marginTop: -10,
  },
  titleSmall: {
    fontSize: 15,
    marginBottom: 10,
    color: COLORS.CREAM[3],
  },
  textWrapper: {
    alignItems: "center",
  },
  star: {
    position: "absolute",
    top: -5,
    zIndex: 5,
    height: 50,
    aspectRatio: 1,
  },
  startTrailing: {
    top: 410,
    left: 330,
  },
  image: {
    aspectRatio: 1 / 1,
    width: "90%",
    marginTop: 25,
    borderRadius: 15,
    borderWidth: 5,
    borderColor: COLORS.PURPLE[1],
  },
});
