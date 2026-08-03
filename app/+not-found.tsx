import { LilitaOne_400Regular } from "@expo-google-fonts/lilita-one";
import { router, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import ImageBackgroundScreen from "@/components/backgrounds/image-background-screen";
import CTA_BTN from "@/components/buttons/cta-btn";
import CustomFont from "@/components/headers/title-header";
import { BASE_URL } from "@/constants/env";

export default function NotFound() {
  const pathname = usePathname();
  const [status, setStatus] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    const checkNetworkStatus = async () => {
      try {
        const response = await fetch(`${BASE_URL}${pathname}`);
        if (isMounted) {
          setStatus(response.status);
        }
      } catch {
        if (isMounted) {
          setStatus(0);
        }
      }
    };

    checkNetworkStatus();

    return () => {
      isMounted = false;
    };
  }, [pathname]);

  return (
    <ImageBackgroundScreen>
      <View style={styles.container}>
        <CustomFont header font={LilitaOne_400Regular}>
          {status === null ? "Loading..." : status}
        </CustomFont>
        <CustomFont font={LilitaOne_400Regular}>
          Something went wrong!
        </CustomFont>
        <CTA_BTN title="Home" onPress={() => router.navigate("/")} />
      </View>
    </ImageBackgroundScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center"
  }
});
