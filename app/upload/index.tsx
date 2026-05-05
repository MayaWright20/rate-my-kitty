import { uploadImage } from "@/api/api";
import CTA_BTN from "@/components/buttons/cta-btn";
import TitleHeader from "@/components/headers/title-header";
import ImageBackgroundScreen from "@/components/screens/image-background-screen";
import ImageUploader from "@/components/upload/image-uploader";
import { COLORS } from "@/constants/colors";
import { LilitaOne_400Regular } from "@expo-google-fonts/lilita-one";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type UploadResult = {
  approved: number;
  [key: string]: unknown;
};

export default function Index() {
  const [image, setImage] = useState<null | string>(null);
  const onChangeImage = useCallback(
    (value: string | null) => {
      setImage(value);
    },
    [setImage],
  );

  const uploadImageHandler = async () => {
    const result = (await uploadImage({ file: image })) as UploadResult;

    if (result["approved"] === 1) {
      router.push("/");
    } else {
      console.log("result res", result);
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
          <TitleHeader
            title={"Submit your cat"}
            font={LilitaOne_400Regular}
            subheading="Upload a photo of your cat to put them in the vote!"
          />
          <ImageUploader getImage={(value) => onChangeImage(value)} />
          <CTA_BTN
            title="Submit"
            icon={{
              name: "paw",
              size: 30,
              color: COLORS.WHITE[0],
            }}
            onPress={uploadImageHandler}
          />
        </ScrollView>
      </SafeAreaView>
    </ImageBackgroundScreen>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  scrollView: {
    alignItems: "center",
    flexGrow: 1,
    paddingBottom: 90,
  },
  title: {
    fontSize: 20,
    textTransform: "uppercase",
  },
  subheader: {
    fontSize: 20,
    marginBottom: 15,
  },
});
