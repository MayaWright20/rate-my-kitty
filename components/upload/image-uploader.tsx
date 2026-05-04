import { COLORS } from "@/constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

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
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <>
      {image && <Image source={{ uri: image }} style={styles.image} />}
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
          <Text style={styles.title}>
            {image ? "Edit photo" : "Tap to upload"}
          </Text>
          <Text>{"Pick your best cat picture!"}</Text>
        </View>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.PURPLE[0],
    borderStyle: "dotted",
    borderWidth: 5,
    borderColor: COLORS.PURPLE[1],
    margin: 15,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  containerSmall: {
    flexDirection: "row",
    aspectRatio: 2 / 0.5,
  },
  containerLarge: {
    width: "90%",
    aspectRatio: 2 / 1.5,
  },
  icon: {
    marginBottom: 5,
  },
  iconSmall: {
    marginRight: 15,
  },
  title: {
    color: COLORS.PURPLE[3],
    fontWeight: "bold",
  },
  titleLarge: {
    fontSize: 25,
    marginBottom: 15,
  },
  titleSmall: {
    fontSize: 15,
    marginBottom: 10,
  },
  textWrapper: {
    alignItems: "center",
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
