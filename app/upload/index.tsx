import TitleHeader from "@/components/headers/title-header";
import ImageBackgroundScreen from "@/components/screens/image-background-screen";
import ImageUploader from "@/components/upload/image-uploader";
import { LilitaOne_400Regular } from "@expo-google-fonts/lilita-one";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <ImageBackgroundScreen>
      <SafeAreaView style={styles.safeAreaView} edges={["top"]}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <TitleHeader
            title={"Submit your cat"}
            font={LilitaOne_400Regular}
            subheading="Upload a photo of your cat to put them in the vote!"
          />
          <ImageUploader />
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
    flex: 1,
  },
  title: {
    fontSize: 20,
    textTransform: "uppercase",
  },
});
