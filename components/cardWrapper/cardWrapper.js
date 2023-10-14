import { Text, View } from "react-native";
import { _styles } from "./style";

export default function CardWrapper({ style, children }) {
  return <View style={{ ..._styles.card, ...style }}>{children}</View>;
}
