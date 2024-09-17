import { Pressable, View, Text } from "react-native";
import { ReactNode } from "react";
import CardWrapper from "../cardWrapper/cardWrapper";
import { _styles } from "./style";

type FlatItemType = {
  name: string;
  value: number;
  icon?: ReactNode;
  options?: ReactNode;
};

export const FlatItem = (content: FlatItemType) => {
  const styles = _styles;
  return (
    <CardWrapper style={{ paddingVertical: 20, paddingHorizontal: 30, maxHeight: 100 }}>
      <Pressable>
        <View style={styles.row}>
          {content.icon && <View style={styles.left}>{content?.icon}</View>}
          <View style={content.icon ? styles.center : styles.left}>
            <Text style={styles.text}>{content.name}</Text>
          </View>
          <View style={styles.right}>
            <View>{content.options}</View>
            <Text style={styles.text}>{`${content.value} €`}</Text>
          </View>
        </View>
      </Pressable>
    </CardWrapper>
  );
};
