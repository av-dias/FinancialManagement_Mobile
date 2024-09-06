import { View, Text } from "react-native";
import { _styles } from "./style";
import { ReactNode } from "react";

type CustomTitleProps = {
  title: string;
  icon?: ReactNode;
};

export const CustomTitle = (props: CustomTitleProps) => {
  const styles = _styles;
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      {props?.icon}
      <Text style={styles.textTitle}>{props.title}</Text>
    </View>
  );
};
