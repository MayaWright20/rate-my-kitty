import { CustomFont } from "@/components/fonts/custom-fonts";
import TitleHeader from "@/components/headers/title-header";
import CustomTextInput from "@/components/inputs/custom-text-input";
import ImageBackgroundScreen from "@/components/screens/image-background-screen";
import ImageUploader from "@/components/upload/image-uploader";
import { LilitaOne_400Regular } from "@expo-google-fonts/lilita-one";
import { SupermercadoOne_400Regular } from "@expo-google-fonts/supermercado-one/400Regular";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function Index() {
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
          <ImageUploader />
          <CustomFont
            font={SupermercadoOne_400Regular}
            style={styles.subheader}
          >
            Tell us about your cat
          </CustomFont>
          <CustomTextInput placeholder="Cat's name" />
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
  },
  title: {
    fontSize: 20,
    textTransform: "uppercase",
  },
  subheader: {
    fontSize: 20,
    textAlign: "left",
    marginBottom: 15,
  },
});
