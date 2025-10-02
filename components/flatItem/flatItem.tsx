import { Pressable, View, Text } from "react-native";
import { ReactNode } from "react";
import CardWrapper from "../cardWrapper/cardWrapper";
import { styles } from "./style";
import commonStyles from "../../utility/commonStyles";
import { dark } from "../../utility/colors";
import { BlurView } from "@react-native-community/blur";
import { BlurText } from "../BlurText/BlurText";

type FlatItemType = {
  name: string | ReactNode;
  value: number | ReactNode;
  icon?: ReactNode;
  options?: ReactNode;
  paddingVertical?: number;
  paddingHorizontal?: number;
  onPressCallback?: ({ name, value }) => void;
  privacyShield?: boolean;
};

const isReactComponent = (variable) =>
  typeof variable === "object" ? true : false;

/**
 * Generic FlatItem that will used to show
 * readonly information throughout the app
 */
export const FlatItem = ({
  name,
  value,
  icon,
  options,
  paddingVertical,
  paddingHorizontal,
  onPressCallback,
  privacyShield = false,
}: FlatItemType) => {
  const onPress = () => {
    onPressCallback && onPressCallback({ name: name, value: value });
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) =>
        commonStyles.onPressBounce(pressed, {}, onPressCallback)
      }
    >
      <CardWrapper
        style={{
          paddingVertical: paddingVertical ? paddingVertical : 15,
          paddingHorizontal: paddingHorizontal ? paddingHorizontal : 30,
          maxHeight: 80,
          backgroundColor: dark.glass,
        }}
      >
        <View style={styles.row}>
          {icon && <View style={styles.left}>{icon}</View>}
          <View style={icon ? styles.center : styles.left}>
            {isReactComponent(name) ? (
              name // If name is a React component, render it directly
            ) : (
              <Text style={styles.text}>{name}</Text>
            )}
          </View>
          <View style={styles.right}>
            <View>{options}</View>
            <View style={styles.textBox}>
              {isReactComponent(value) ? (
                value // If value is a React component, render it directly
              ) : (
                <BlurText
                  text={
                    <Text>
                      <Text style={styles.text}>{value}</Text>
                      <Text style={styles.textSymbol}>{`€`}</Text>
                    </Text>
                  }
                  privacyShield={privacyShield}
                  style={undefined}
                />
              )}
            </View>
          </View>
        </View>
      </CardWrapper>
    </Pressable>
  );
};
