import React, { memo, useEffect } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from "react-native-reanimated";

import { COLORS } from "@/constants/colors";
import { BORDER_WIDTH, FONT_SIZE } from "@/constants/styles";

type Props = {
  value: boolean;
  onChange: (value: boolean) => void;
  leftLabel?: string;
  rightLabel?: string;
  style?: StyleProp<ViewStyle>;
};

const SWITCH_WIDTH = 108;
const SWITCH_HEIGHT = 42;
const PADDING = 4;
const ACTIVE_BTN_WIDTH = (SWITCH_WIDTH - PADDING * 2) / 2;

export function SwitchBTN({
  value,
  onChange,
  leftLabel = "LIST",
  rightLabel = "GRID",
  style
}: Props) {
  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(value ? 1 : 0, {
      damping: 18,
      stiffness: 180,
      mass: 0.7
    });
  }, [value, progress]);

  const activeBtnStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * ACTIVE_BTN_WIDTH }]
  }));

  return (
    <Pressable
      testID="switch-btn"
      onPress={() => onChange(!value)}
      style={[styles.switch, style ? style : undefined]}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      hitSlop={12}
    >
      <Animated.View style={[styles.active, activeBtnStyle]} />

      <View style={styles.labelRow}>
        <Text
          testID="switch-btn-left-label"
          style={[styles.label, !value && styles.activeLabel]}
        >
          {leftLabel}
        </Text>
        <Text style={[styles.label, value && styles.activeLabel]}>
          {rightLabel}
        </Text>
      </View>
    </Pressable>
  );
}

export default memo(SwitchBTN);

const styles = StyleSheet.create({
  active: {
    backgroundColor: COLORS.CREAM[0],
    borderRadius: SWITCH_HEIGHT / 2,
    borderWidth: BORDER_WIDTH.SMALL,
    height: SWITCH_HEIGHT - PADDING * 2,
    left: PADDING / 2,
    position: "absolute",
    top: PADDING / 2,
    width: ACTIVE_BTN_WIDTH
  },
  activeLabel: {
    color: COLORS.BLACK[3]
  },
  label: {
    color: COLORS.CREAM[0],
    fontSize: FONT_SIZE.SMALL,
    fontWeight: "700",
    letterSpacing: 0.8,
    textAlign: "center",
    width: ACTIVE_BTN_WIDTH
  },
  labelRow: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row"
  },
  switch: {
    alignItems: "center",
    backgroundColor: COLORS.GREEN[0],
    borderColor: COLORS.BLACK[3],
    borderRadius: SWITCH_HEIGHT / 2,
    borderWidth: BORDER_WIDTH.SMALL,
    height: SWITCH_HEIGHT,
    overflow: "hidden",
    padding: PADDING,
    width: SWITCH_WIDTH
  }
});
