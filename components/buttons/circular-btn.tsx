import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import {
  GestureResponderEvent,
  OpaqueColorValue,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import { COLORS } from "@/constants/colors";
import { Icon } from "@/types";

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
  titleColor
}: Props) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.circle}>
        <Ionicons name={icon?.name} color={icon?.color} size={icon?.size} />
      </View>
      <Text
        style={[
          styles.title,
          { color: titleColor ? titleColor : COLORS.BLACK[2] }
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: "center",
    alignSelf: "center",
    aspectRatio: 1,
    backgroundColor: COLORS.PURPLE[3],
    borderColor: COLORS.CREAM[0],
    borderRadius: 100,
    borderWidth: 7,
    justifyContent: "center",
    maxHeight: 100,
    maxWidth: 100,
    top: "-15%",
    width: "70%"
  },
  container: {
    alignItems: "center",
    top: "-70%"
  },
  title: {
    fontSize: 9,
    fontWeight: "bold",
    textTransform: "uppercase",
    top: "-17%"
  }
});
