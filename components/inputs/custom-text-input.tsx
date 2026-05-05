import { COLORS } from "@/constants/colors";
import { OPACITY } from "@/constants/styles";
import { useState } from "react";
import { StyleSheet, TextInput } from "react-native";

interface Props {
  placeholder?: string;
}

export default function CustomTextInput({ placeholder }: Props) {
  const [text, onChangeText] = useState("");

  return (
    <TextInput
      style={styles.input}
      onChangeText={onChangeText}
      value={text}
      placeholder={placeholder}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: COLORS.PURPLE[0],
    opacity: OPACITY[1],
    width: "90%",
    aspectRatio: 2 / 0.4,
    paddingHorizontal: 15,
    borderRadius: 15,
    fontSize: 20,
    borderWidth: 3,
    borderColor: COLORS.PURPLE[1],
    marginBottom: 10,
  },
});
