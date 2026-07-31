import Ionicons from "@expo/vector-icons/Ionicons";
import { useContext } from "react";
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
import { BORDER_RADIUS, BORDER_WIDTH, FONT_SIZE } from "@/constants/styles";
import { IsScreenPortraitContext } from "@/context/screen-orientation-context";
import { Icon } from "@/types";

interface Props {
  icon?: Icon;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
  title?: string;
  titleColor?: string | OpaqueColorValue;
  style?: ViewStyle;
  backgroundColor?: string | OpaqueColorValue;
}

export const PORTRAIT_SCREEN_WIDTH = "70%";
export const HORIZONAL_SCREEN_WIDTH = "40%";

export default function CircularBTN({
  icon,
  onPress,
  title,
  titleColor,
  style,
  backgroundColor = COLORS.PURPLE[3]
}: Props) {
  const isScreenPortrait = useContext(IsScreenPortraitContext);

  return (
    <TouchableOpacity testID="circular-btn" onPress={onPress} style={style}>
      <View
        testID="circular-btn-icon-wrapper"
        style={[
          styles.circle,
          {
            backgroundColor,
            width: isScreenPortrait
              ? PORTRAIT_SCREEN_WIDTH
              : HORIZONAL_SCREEN_WIDTH
          }
        ]}
      >
        {icon && (
          <Ionicons
            testID="circular-btn-icon"
            name={icon?.name}
            color={icon?.color}
            size={icon?.size}
          />
        )}
      </View>
      {title && (
        <Text
          style={[
            styles.title,
            { color: titleColor ? titleColor : COLORS.BLACK[2] }
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: "center",
    aspectRatio: 1,
    borderColor: COLORS.BLACK[3],
    borderRadius: BORDER_RADIUS.LARGE,
    borderWidth: BORDER_WIDTH.MEDIUM,
    justifyContent: "center",
    maxHeight: 130,
    maxWidth: 100,
    top: "-15%"
  },
  title: {
    fontSize: FONT_SIZE.SMALL,
    fontWeight: "bold",
    textTransform: "uppercase",
    top: "-17%"
  }
});
