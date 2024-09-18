import { Pressable, View, Text } from "react-native";
import { ReactNode } from "react";
import CardWrapper from "../cardWrapper/cardWrapper";
import { _styles } from "./style";

type FlatItemType = {
  name: string;
  value: number;
  icon?: ReactNode;
  options?: ReactNode;
  onPressCallback?: ({ name, value }) => void;
};

export const FlatItem = (content: FlatItemType) => {
  const styles = _styles;

  const onPress = () => {
    content.onPressCallback && content.onPressCallback({ name: content.name, value: content.value });
  };

  return (
    <CardWrapper style={{ paddingVertical: 20, paddingHorizontal: 30, maxHeight: 100 }}>
      <Pressable onPress={onPress}>
        <View style={styles.row}>
          {content.icon && <View style={styles.left}>{content?.icon}</View>}
          <View style={content.icon ? styles.center : styles.left}>
            <Text style={styles.text}>{content.name}</Text>
          </View>
          <View style={styles.right}>
            <View>{content.options}</View>
            <View style={styles.textBox}>
              <Text style={styles.text}>{`${content.value} €`}</Text>
            </View>
          </View>
        </View>
      </Pressable>
    </CardWrapper>
  );
};
