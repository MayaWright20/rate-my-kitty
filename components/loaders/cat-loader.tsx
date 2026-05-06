import LottieView from "lottie-react-native";
import { StyleSheet, View } from "react-native";

export default function CatLoader() {
  return (
    <View style={styles.wrapper}>
      <LottieView
        source={require("../../assets/animations/cat-loader.json")}
        autoPlay
        loop
        style={styles.animation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  animation: {
    height: 120,
    width: 120
  },
  wrapper: {
    alignItems: "center",
    justifyContent: "center"
  }
});
