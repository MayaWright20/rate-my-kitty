import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import {
  GestureResponderEvent,
  OpaqueColorValue,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle
} from "react-native";

import { COLORS } from "@/constants/colors";
import { Icon } from "@/types";

interface Props {
  icon?: Icon;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
  title?: string;
  titleColor?: string | OpaqueColorValue;
  style?: ViewStyle;
  backgroundColor?: string | OpaqueColorValue;
  isLarge?: boolean;
  isOval?: boolean;
}

export default function CircularBTN({
  icon,
  onPress,
  title,
  titleColor,
  style,
  backgroundColor = COLORS.PURPLE[3],
  isLarge,
  isOval
}: Props) {
  return (
    <TouchableOpacity onPress={onPress} style={style}>
      <View
        style={[
          styles.circle,
          {
            backgroundColor,
            width: isLarge ? "100%" : "70%",
            aspectRatio: isOval ? 1 / 1.2 : 1
          }
        ]}
      >
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
    borderColor: COLORS.CREAM[0],
    borderRadius: 100,
    borderWidth: 7,
    justifyContent: "center",
    maxHeight: 130,
    maxWidth: 100,
    top: "-15%"
  },
  title: {
    fontSize: 9,
    fontWeight: "bold",
    textTransform: "uppercase",
    top: "-17%"
  }
});
