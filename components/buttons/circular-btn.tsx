import { COLORS } from "@/constants/colors";
import { Icon } from "@/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import {
  GestureResponderEvent,
  OpaqueColorValue,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  icon?: Icon;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
  title?: string;
  titleColor?: string | OpaqueColorValue;
}

export default function CircularBTN({
  icon,
  onPress,
  title,
  titleColor,
}: Props) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.circle}>
        <Ionicons name={icon?.name} color={icon?.color} size={icon?.size} />
      </View>
      <Text
        style={[
          styles.title,
          { color: titleColor ? titleColor : COLORS.BLACK[2] },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    top: "-70%",
    alignItems: "center",
  },
  circle: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    aspectRatio: 1,
    alignSelf: "center",
    top: "-15%",
    width: "70%",
    maxWidth: 100,
    maxHeight: 100,
    borderWidth: 7,
    borderColor: COLORS.CREAM[0],
    backgroundColor: COLORS.PURPLE[3],
  },
  title: {
    fontSize: 9,
    top: "-17%",
    textTransform: "uppercase",
    fontWeight: "bold",
  },
});
