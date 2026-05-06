import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  Alert,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";

import { COLORS } from "@/constants/colors";
import {
  BORDER_RADIUS,
  OPACITY,
  SCREEN_WIDTH_MARGIN
} from "@/constants/styles";
import { IsScreenPortraitContext } from "@/context/screen-orientation-context";
import CartoonGenerator from "@/helpers/cartoon-generator";

const STAR = require("../../assets/images/sparcles/star-purple.png");

interface Props {
  getImage: (value: ImagePicker.ImagePickerAsset | null) => void;
  resetImages?: boolean;
}

export default function ImageUploader({ getImage, resetImages }: Props) {
  const isScreenPortrait = useContext(IsScreenPortraitContext);
  const [image, setImage] = useState<string | null>(null);
  const [cartoon, setCartoon] = useState<null | ImageSourcePropType[]>(
    CartoonGenerator()
  );
  const objectUrlRef = useRef<string | null>(null);

  const clearObjectUrl = useCallback(() => {
    if (objectUrlRef.current && typeof URL !== "undefined") {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (resetImages) {
      clearObjectUrl();
      setImage(null);
      setCartoon(null);
    }
  }, [clearObjectUrl, resetImages]);

  useEffect(() => clearObjectUrl, [clearObjectUrl]);

  const onImagePicked = useCallback(
    (result: ImagePicker.ImagePickerSuccessResult) => {
      const pickedImage = result.assets[0];
      const previewUri =
        pickedImage.file && typeof URL !== "undefined"
          ? URL.createObjectURL(pickedImage.file)
          : pickedImage.uri;

      clearObjectUrl();

      if (previewUri !== pickedImage.uri) {
        objectUrlRef.current = previewUri;
      }

      setImage(previewUri);
      getImage(pickedImage);
    },
    [clearObjectUrl, getImage]
  );

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "Permission to access the media library is required."
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1
    });
    setCartoon(CartoonGenerator());

    if (!result.canceled) {
      onImagePicked(result);
    }
  };

  return (
    <View
      style={[
        styles.wrapper,
        isScreenPortrait === false ? styles.wrapperHorizontal : undefined
      ]}
    >
      {image && (
        <View style={styles.previewWrapper}>
          <Image source={{ uri: image }} style={styles.image} />
          <Image source={STAR} style={styles.star} />
          <Image source={STAR} style={[styles.star, styles.startTrailing]} />
          <Image
            source={cartoon && cartoon[0]}
            contentFit="contain"
            style={[styles.cartoon]}
          />
          <Image
            source={cartoon && cartoon[1]}
            style={[styles.badge]}
            contentFit="contain"
          />
        </View>
      )}
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
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    height: 80,
    left: "-7%",
    position: "absolute",
    top: "78%",
    width: "50%",
    zIndex: 5
  },
  cartoon: {
    aspectRatio: 1,
    height: 80,
    position: "absolute",
    right: -15,
    top: "30%",
    zIndex: 5
  },
  container: {
    alignItems: "center",
    borderRadius: BORDER_RADIUS.MEDIUM,
    borderStyle: "dotted",
    borderWidth: 5,
    justifyContent: "center",
    margin: 15,
    opacity: OPACITY[1]
  },
  containerLarge: {
    aspectRatio: 2 / 1.5,
    backgroundColor: COLORS.PURPLE[0],
    borderColor: COLORS.PURPLE[1],
    width: SCREEN_WIDTH_MARGIN
  },
  containerSmall: {
    aspectRatio: 2 / 0.5,
    backgroundColor: COLORS.CREAM[0],
    borderColor: COLORS.CREAM[3],
    flexDirection: "row"
  },
  icon: {
    marginBottom: 5
  },
  iconSmall: {
    color: COLORS.CREAM[3],
    marginRight: 15
  },
  image: {
    aspectRatio: 1 / 1,
    borderColor: COLORS.PURPLE[1],
    borderRadius: BORDER_RADIUS.MEDIUM,
    borderWidth: 5,
    marginTop: 25,
    width: SCREEN_WIDTH_MARGIN
  },
  label: {
    color: COLORS.BLACK[3]
  },
  labelSmall: {
    color: COLORS.CREAM[3],
    marginTop: -10
  },
  previewWrapper: {
    alignItems: "center",
    position: "relative",
    width: "100%"
  },
  star: {
    aspectRatio: 1,
    height: 50,
    position: "absolute",
    top: -5,
    zIndex: 5
  },
  startTrailing: {
    right: 0,
    top: "90%"
  },
  textWrapper: {
    alignItems: "center"
  },
  title: {
    fontWeight: "bold"
  },
  titleLarge: {
    color: COLORS.PURPLE[3],
    fontSize: 25,
    marginBottom: 15
  },
  titleSmall: {
    color: COLORS.CREAM[3],
    fontSize: 15,
    marginBottom: 10
  },
  wrapper: {
    alignItems: "center",
    width: "100%"
  },
  wrapperHorizontal: {
    maxWidth: "40%"
  }
});
