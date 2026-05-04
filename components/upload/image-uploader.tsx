import { COLORS } from "@/constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, Text } from "react-native";

export default function ImageUploader() {
  return (
    <Pressable style={styles.container}>
      <Ionicons
        style={styles.icon}
        name={"camera"}
        color={COLORS.PURPLE[3]}
        size={70}
      />
      <Text style={styles.title}>Tap to upload</Text>
      <Text style={styles.subheading}>Pick your best cat picture!</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.PURPLE[0],
    width: "90%",
    borderStyle: "dotted",
    borderWidth: 5,
    borderColor: COLORS.PURPLE[1],
    aspectRatio: 2 / 1.5,
    margin: 15,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginBottom: 5,
  },
  title: {
    color: COLORS.PURPLE[3],
    fontWeight: "bold",
    fontSize: 25,
    marginBottom: 15,
  },
  subheading: {},
});
