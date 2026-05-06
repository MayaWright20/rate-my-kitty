import { LilitaOne_400Regular } from "@expo-google-fonts/lilita-one";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ImageBackgroundScreen from "@/components/backgrounds/image-background-screen";
import CTA_BTN from "@/components/buttons/cta-btn";
import CustomFont from "@/components/headers/title-header";
import ImageUploader from "@/components/upload/image-uploader";
import { COLORS } from "@/constants/colors";
import { SCREEN_WIDTH_MARGIN } from "@/constants/styles";
import useUploadImage from "@/hooks/useUploadImage";

export default function Index() {
  const {
    errorMessage,
    image,
    isSubmitBtnDisabled,
    onChangeImage,
    uploadSelectedImage
  } = useUploadImage();

  const uploadImageHandler = async () => {
    const isUploaded = await uploadSelectedImage();

    if (isUploaded) {
      router.push("/");
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
