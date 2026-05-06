import Ionicons from "@expo/vector-icons/Ionicons";
import { SupermercadoOne_400Regular } from "@expo-google-fonts/supermercado-one/400Regular";
import { useContext } from "react";
import {
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity
} from "react-native";

import { COLORS } from "@/constants/colors";
import { BORDER_RADIUS, SCREEN_WIDTH_MARGIN } from "@/constants/styles";
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
    marginRight: 5
  },
  title: {
    color: COLORS.WHITE[0],
    fontSize: 30,
    textAlign: "center",
    textTransform: "uppercase"
  }
});
