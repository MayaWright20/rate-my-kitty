import { SupermercadoOne_400Regular } from "@expo-google-fonts/supermercado-one/400Regular";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useContext } from "react";
import {
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity
} from "react-native";

import { COLORS } from "@/constants/colors";
import {
  BORDER_RADIUS,
  FONT_SIZE,
  MARGIN,
  SCREEN_WIDTH_MARGIN
} from "@/constants/styles";
import { IsScreenPortraitContext } from "@/context/screen-orientation-context";
import { Icon } from "@/types";

import CustomFont from "../headers/title-header";

interface Props {
  title: string;
  icon?: Icon;
  onPress: ((event: GestureResponderEvent) => void) | undefined;
  isDisabled?: boolean;
}

export default function CTA_BTN({ title, icon, onPress, isDisabled }: Props) {
  const isScreenPortrait = useContext(IsScreenPortraitContext);

  return (
    <TouchableOpacity
      testID="cta-btn"
      onPress={onPress}
      disabled={isDisabled}
      style={[
        styles.container,
        isScreenPortrait === false ? styles.containerHorizontal : undefined,
        { backgroundColor: isDisabled ? COLORS.BLACK[1] : COLORS.PURPLE[3] }
      ]}
    >
      {icon && (
        <Ionicons
          testID="cta-btn-icon"
          style={styles.icon}
          name={icon?.name}
          color={icon?.color}
          size={icon?.size}
        />
      )}
      <CustomFont font={SupermercadoOne_400Regular} style={styles.title}>
        {title}
      </CustomFont>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    borderRadius: BORDER_RADIUS.LARGE,
    flexDirection: "row",
    justifyContent: "center",
    width: SCREEN_WIDTH_MARGIN
  },
  containerHorizontal: {
    maxWidth: "40%"
  },
  icon: {
    marginRight: MARGIN.MEDIUM
  },
  title: {
    color: COLORS.WHITE[0],
    fontSize: FONT_SIZE.X_LARGE,
    textAlign: "center",
    textTransform: "uppercase"
  }
});
