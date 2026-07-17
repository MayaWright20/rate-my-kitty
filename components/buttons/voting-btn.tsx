import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { COLORS } from "@/constants/colors";
import {
  BORDER_RADIUS,
  BORDER_WIDTH,
  FONT_SIZE,
  MARGIN
} from "@/constants/styles";

type Props = {
  count: number;
  onDownvote: () => void;
  onUpvote: () => void;
};

const ACCESSIBILITY_LABEL_DOWN = "Down vote cat";
const ACCESSIBILITY_LABEL_UP = "Up vote cat";
const BTN_HEIGHT = 40;
const LABEL_WIDTH = 54;
const VOTE_BTN_WIDTH = 34;

export default function VoteButton({ count, onDownvote, onUpvote }: Props) {
  const ICON_SIZE = 20;

  return (
    <View testID="vote-button" style={styles.votePill}>
      <TouchableOpacity
        accessibilityLabel={ACCESSIBILITY_LABEL_UP}
        accessibilityRole="button"
        onPress={onUpvote}
        style={[styles.voteSide, styles.voteSideUp]}
      >
        <Ionicons
          name={"caret-up-outline"}
          color={COLORS.BLACK[3]}
          size={ICON_SIZE}
        />
      </TouchableOpacity>
      <View style={[styles.countLabel]}>
        <Text style={styles.count}>{count}</Text>
        <Text style={styles.label}>votes</Text>
      </View>
      <TouchableOpacity
        accessibilityLabel={ACCESSIBILITY_LABEL_DOWN}
        accessibilityRole="button"
        onPress={onDownvote}
        style={[styles.voteSide, styles.voteSideDown]}
      >
        <Ionicons
          name={"caret-down-outline"}
          color={COLORS.BLACK[3]}
          size={ICON_SIZE}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  count: {
    fontSize: FONT_SIZE.MEDIUM,
    fontWeight: "bold"
  },
  countLabel: {
    alignItems: "center",
    backgroundColor: COLORS.CREAM[1],
    borderLeftWidth: BORDER_WIDTH.SMALL,
    borderRightWidth: BORDER_WIDTH.SMALL,
    height: BTN_HEIGHT,
    justifyContent: "center"
  },
  icon: {
    fontSize: FONT_SIZE.MEDIUM,
    fontWeight: "bold",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0
  },
  label: {
    fontSize: FONT_SIZE.SMALL,
    fontWeight: "bold",
    marginTop: MARGIN.SMALL,
    minWidth: LABEL_WIDTH,
    textAlign: "center",
    textTransform: "uppercase"
  },
  votePill: {
    alignItems: "center",
    alignSelf: "center",
    borderRadius: BORDER_RADIUS.LARGE,
    borderWidth: BORDER_WIDTH.SMALL,
    bottom: 18,
    elevation: 8,
    flexDirection: "row",
    margin: MARGIN.MEDIUM,
    overflow: "hidden",
    position: "absolute",
    right: 5,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 0
  },
  voteSide: {
    alignItems: "center",
    height: BTN_HEIGHT,
    justifyContent: "center",
    width: VOTE_BTN_WIDTH
  },
  voteSideDown: {
    backgroundColor: COLORS.PINK[1]
  },
  voteSideUp: {
    backgroundColor: COLORS.GREEN[1]
  }
});
