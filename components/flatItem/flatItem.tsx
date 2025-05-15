import { Pressable, View, Text } from "react-native";
import { ReactNode } from "react";
import CardWrapper from "../cardWrapper/cardWrapper";
import { _styles } from "./style";
import commonStyles from "../../utility/commonStyles";

type FlatItemType = {
  name: string;
  value: number;
  icon?: ReactNode;
  options?: ReactNode;
  padding?: number;
  onPressCallback?: ({ name, value }) => void;
};

export const FlatItem = (content: FlatItemType) => {
  const styles = _styles;

  const onPress = () => {
    content.onPressCallback && content.onPressCallback({ name: content.name, value: content.value });
  };

  return (
    //style={({ pressed }) => [{ backgroundColor: pressed ? 'black' : 'white' }, styles.btn ]}>

    <Pressable onPress={onPress} style={({ pressed }) => commonStyles.onPressBounce(pressed, {}, content.onPressCallback)}>
      <CardWrapper style={{ paddingVertical: content.padding ? content.padding : 15, paddingHorizontal: 30, maxHeight: 80 }}>
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
      </CardWrapper>
    </Pressable>
  );
};
