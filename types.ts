import Ionicons from "@expo/vector-icons/Ionicons";
import { ImagePickerAsset } from "expo-image-picker";
import { OpaqueColorValue } from "react-native";

export interface ImageUpload {
  file: ImagePickerAsset;
  sub_id?: string;
  breed_ids?: string[];
}

export type Icon = {
  name: React.ComponentProps<typeof Ionicons>["name"];
  size: number;
  color: string | OpaqueColorValue;
};

interface Breed {
  id: number;
  name: string;
  wikipedia_url: string;
}

export interface CatImage {
  id: string;
  url: string;
  width: null | number;
  height: null | number;
  mime_type: string;
  entities: string[];
  breeds: Breed[];
  animals: string[];
  categories: string[];
}

export type Favourite = {
  id: number;
  image_id: string;
  image?: CatImage;
  sub_id?: string;
};

export type ImageUploadResult = { approved?: number } | string | false;

export type FavouriteResult = { id?: number; message: string };

export type VoteValue = 1 | 0;

export type Vote = {
  country_code?: string;
  created_at?: string;
  id: number;
  image?: CatImage;
  image_id: string;
  sub_id?: string;
  value: VoteValue;
};
