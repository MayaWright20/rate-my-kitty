import Ionicons from "@expo/vector-icons/Ionicons";
import { OpaqueColorValue } from "react-native";

export interface ImageUpload {
  file: any;
  sub_id?: string;
  breed_ids?: string[];
}

export type Icon = {
  name: React.ComponentProps<typeof Ionicons>["name"];
  size: number;
  color: string | OpaqueColorValue;
};
