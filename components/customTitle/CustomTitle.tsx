import { View, Text, ViewStyle, TextStyle } from "react-native";
import { _styles } from "./style";
import { ReactNode } from "react";

type CustomTitleProps = {
  title: string;
  icon?: ReactNode;
  textStyle?: TextStyle;
  containerStyle?: ViewStyle;
};

export const CustomTitle = (props: CustomTitleProps) => {
  const styles = _styles;
  return (
    <View style={{ flexDirection: "row", alignItems: "center", ...props.containerStyle }}>
      {props?.icon}
      <Text style={{ ...styles.textTitle, ...props.textStyle }}>{props.title}</Text>
    </View>
  );
};
