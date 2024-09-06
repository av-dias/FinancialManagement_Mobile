import { Pressable } from "react-native";
import { _styles } from "./style";
import { ReactNode } from "react";

type IconButtonProps = {
  icon: ReactNode;
  onPressHandle: () => void;
};

export const IconButton = (props: IconButtonProps) => {
  const styles = _styles;

  return (
    <Pressable style={styles.iconButton} onPress={props.onPressHandle}>
      {props.icon}
    </Pressable>
  );
};
