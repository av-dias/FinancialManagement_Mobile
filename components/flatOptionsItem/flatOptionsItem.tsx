import { ReactNode } from "react";
import { Pressable, View } from "react-native";
import commonStyles from "../../utility/commonStyles";
import { findIcon } from "../../utility/icons";
import CardWrapper from "../cardWrapper/cardWrapper";
import { styles } from "./style";
import { dark } from "../../utility/colors";
import { BlurText } from "../BlurText/BlurText";

type FlatItemType = {
  name: ReactNode;
  value: ReactNode;
  icon?: ReactNode;
  options?: { callback: () => void; type: string }[];
  paddingVertical?: number;
  paddingHorizontal?: number;
  onPressCallback?: ({ name, value }) => void;
  privacyShield?: boolean;
};

/**
 * Generic FlatItem that contains Options
 * This will be a base component to list
 * Information throughout the app
 */
export const FlatOptionsItem = ({
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

  const loadOptions = () =>
    options.map((option, id) => (
      <Pressable key={id} onPress={option.callback}>
        <View style={styles.optionBox}>{findIcon(option.type, 20)}</View>
      </Pressable>
    ));

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
          <View style={{ ...styles.row, flex: 1 }}>
            <View style={{ ...styles.row, gap: 10 }}>
              {icon && <View>{icon}</View>}
              {name}
            </View>
            <BlurText
              text={
                <View style={styles.right}>
                  <View style={styles.textBox}>{value}</View>
                </View>
              }
              privacyShield={privacyShield}
              style={styles.right}
            />
          </View>
          <View style={styles.optionsContainer}>{loadOptions()}</View>
        </View>
      </CardWrapper>
    </Pressable>
  );
};
