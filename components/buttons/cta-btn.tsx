import { SupermercadoOne_400Regular } from "@expo-google-fonts/supermercado-one/400Regular";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity
} from "react-native";

import { COLORS } from "@/constants/colors";
import { SCREEN_WIDTH_MARGIN } from "@/constants/styles";
import { Icon } from "@/types";

import { CustomFont } from "../fonts/custom-fonts";

interface Props {
  title: string;
  icon?: Icon;
  onPress: ((event: GestureResponderEvent) => void) | undefined;
  isDisabled?: boolean;
}

export default function CTA_BTN({ title, icon, onPress, isDisabled }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      style={[
        styles.container,
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
    borderRadius: 150,
    flexDirection: "row",
    height: 50,
    justifyContent: "center",
    width: SCREEN_WIDTH_MARGIN
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
