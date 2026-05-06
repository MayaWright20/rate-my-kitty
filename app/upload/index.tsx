import { LilitaOne_400Regular } from "@expo-google-fonts/lilita-one";
import { ImagePickerAsset } from "expo-image-picker";
import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { uploadImage } from "@/api/api";
import ImageBackgroundScreen from "@/components/backgrounds/image-background-screen";
import CTA_BTN from "@/components/buttons/cta-btn";
import CustomFont from "@/components/headers/title-header";
import ImageUploader from "@/components/upload/image-uploader";
import { COLORS } from "@/constants/colors";
import { SCREEN_WIDTH_MARGIN } from "@/constants/styles";

export default function Index() {
  const [image, setImage] = useState<ImagePickerAsset | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>();
  const isSubmitBtnDisabled = useMemo(
    () => !image || !!errorMessage,
    [image, errorMessage]
  );

  const onChangeImage = useCallback(
    (value: ImagePickerAsset | null) => {
      setImage(value);
      setErrorMessage(undefined);
    },
    [setImage]
  );

  const uploadImageHandler = async () => {
    if (!image) {
      return;
    }

    const result = await uploadImage({ file: image });

    if (typeof result === "object" && result && result.approved === 1) {
      router.push("/");
      setImage(null);
      onChangeImage(null);
    } else {
      setErrorMessage(
        typeof result === "string" ? result : "Image upload failed"
      );
    }
  };
  return (
    <ImageBackgroundScreen>
      <SafeAreaView style={styles.safeAreaView} edges={["top"]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollView}
        >
          <CustomFont
            header
            font={LilitaOne_400Regular}
            subheading="Upload a photo of your cat to put them in the vote!"
          >
            Submit your cat
          </CustomFont>
          <ImageUploader
            resetImages={image === null}
            getImage={(value) => onChangeImage(value)}
          />
          <CTA_BTN
            isDisabled={isSubmitBtnDisabled}
            title="Submit"
            icon={{
              name: "paw",
              size: 30,
              color: COLORS.WHITE[0]
            }}
            onPress={uploadImageHandler}
          />
          {errorMessage && (
            <Text
              style={styles.errorMessage}
            >{`*${errorMessage} \n   Please try again`}</Text>
          )}
        </ScrollView>
      </SafeAreaView>
    </ImageBackgroundScreen>
  );
}

const styles = StyleSheet.create({
  errorMessage: {
    color: COLORS.RED[0],
    fontWeight: "bold",
    marginTop: 15,
    textAlign: "right",
    width: SCREEN_WIDTH_MARGIN
  },
  safeAreaView: {
    flex: 1
  },
  scrollView: {
    alignItems: "center",
    flexGrow: 1,
    paddingBottom: 90
  },
  subheader: {
    fontSize: 20,
    marginBottom: 15
  },
  title: {
    fontSize: 20,
    textTransform: "uppercase"
  }
});
