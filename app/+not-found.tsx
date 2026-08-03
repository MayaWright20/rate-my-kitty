import { LilitaOne_400Regular } from "@expo-google-fonts/lilita-one";

import ImageBackgroundScreen from "@/components/backgrounds/image-background-screen";
import CustomFont from "@/components/headers/title-header";

export default function NotFound() {
  return (
    <ImageBackgroundScreen>
      <CustomFont header font={LilitaOne_400Regular}>
        Page Not found
      </CustomFont>
    </ImageBackgroundScreen>
  );
}
