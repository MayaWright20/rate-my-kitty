import { ImageSourcePropType } from "react-native";

export default function CartoonGenerator(): ImageSourcePropType[] {
  const cartoons: Record<string, ImageSourcePropType> = {
    1: require(`../assets/images/cartoons/cartoon-1.png`),
    2: require(`../assets/images/cartoons/cartoon-2.png`),
    3: require(`../assets/images/cartoons/cartoon-3.png`),
    4: require(`../assets/images/cartoons/cartoon-4.png`),
    5: require(`../assets/images/cartoons/cartoon-5.png`),
    6: require(`../assets/images/cartoons/cartoon-6.png`),
    7: require(`../assets/images/cartoons/cartoon-7.png`),
    8: require(`../assets/images/cartoons/cartoon-8.png`),
    9: require(`../assets/images/cartoons/cartoon-9.png`),
    10: require(`../assets/images/cartoons/cartoon-10.png`)
  };

  const badges: Record<string, ImageSourcePropType> = {
    1: require(`../assets/images/badges/badge-1.png`),
    2: require(`../assets/images/badges/badge-2.png`),
    3: require(`../assets/images/badges/badge-3.png`),
    4: require(`../assets/images/badges/badge-4.png`),
    5: require(`../assets/images/badges/badge-5.png`),
    6: require(`../assets/images/badges/badge-6.png`),
    7: require(`../assets/images/badges/badge-7.png`),
    8: require(`../assets/images/badges/badge-8.png`),
    9: require(`../assets/images/badges/badge-9.png`),
    10: require(`../assets/images/badges/badge-10.png`)
  };

  const keys = Object.keys(cartoons);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return [cartoons[randomKey], badges[randomKey]];
}
