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

type Props = {
  value: boolean;
  onChange: (value: boolean) => void;
  leftLabel?: string;
  rightLabel?: string;
  style?: StyleProp<ViewStyle>;
};

const SWITCH_W = 108;
const SWITCH_H = 42;
const PADDING = 4;
const THUMB_W = (SWITCH_W - PADDING * 2) / 2;

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

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * THUMB_W }]
  }));

  return (
    <Pressable
      onPress={() => onChange(!value)}
      style={[styles.switch, style ? style : undefined]}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      hitSlop={12}
    >
      <Animated.View style={[styles.thumb, thumbStyle]} />

      <View style={styles.labelRow}>
        <Text style={[styles.label, !value && styles.activeLabel]}>
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
  activeLabel: {
    color: COLORS.BLACK[3]
  },
  label: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    textAlign: "center",
    width: THUMB_W
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
    borderRadius: SWITCH_H / 2,
    borderWidth: 2,
    height: SWITCH_H,
    overflow: "hidden",
    padding: PADDING,
    width: SWITCH_W
  },
  thumb: {
    backgroundColor: "#FFFFFF",
    borderRadius: SWITCH_H / 2,
    borderWidth: 2,
    height: SWITCH_H - PADDING * 2,
    left: PADDING / 2,
    position: "absolute",
    top: PADDING / 2,
    width: THUMB_W
  }
});
