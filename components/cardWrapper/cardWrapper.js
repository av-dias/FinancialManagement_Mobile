import { Text, View } from "react-native";
import { _styles } from "./style";

export default function CardWrapper({ noStyle = false, style = undefined, children }) {
  return <View style={noStyle ? {} : { ..._styles.card, ...style }}>{children}</View>;
}
