import { Text, View, ScrollView, Pressable } from "react-native";
import { _styles } from "./style";
import { verticalScale } from "../../functions/responsive";
import CardWrapper from "../cardWrapper/cardWrapper";
import { categoryIcons } from "../../utility/icons";
import { ReactNode } from "react";
import { TypeIcon } from "../TypeIcon/TypeIcon";
const BORDER_RADIUS = 10;

type CarrosselProps = {
  type: any;
  setType: any;
  size: any;
  iconSize?: any;
  iconBackground?: string;
  iconBorderColor?: string;
  items?: CarrosselItemsType[];
  onLongPress?: (id: any) => void;
};

export type CarrosselItemsType = {
  label: string;
  color: string;
  icon?: ReactNode;
};

export default function Carrossel({
  type,
  setType,
  size,
  iconSize = 30,
  items = categoryIcons(iconSize),
  iconBackground = "transparent",
  iconBorderColor = "transparent",
  onLongPress = () => {},
}: CarrosselProps) {
  const styles = _styles;

  return (
    <View
      style={{
        backgroundColor: "transparent",
        height: size,
        borderRadius: BORDER_RADIUS,
      }}
    >
      <ScrollView
        horizontal={true}
        style={styles.categoryScrollContainer}
        contentContainerStyle={{
          gap: verticalScale(5),
          paddingHorizontal: 1,
        }}
      >
        {items.map((iconComponent) => {
          return (
            <CardWrapper
              key={iconComponent.label}
              style={{
                backgroundColor:
                  type == iconComponent.label
                    ? iconComponent.color
                    : iconBackground,
                width: size,
                borderWidth: 1,
                borderColor: iconBorderColor,
              }}
            >
              <Pressable
                key={iconComponent.label}
                style={styles.categoryContainer}
                onPress={() => setType(iconComponent.label)}
                onLongPress={() => onLongPress(iconComponent.label)}
              >
                {iconComponent?.icon && (
                  <View style={styles.categoryIconContainer}>
                    <TypeIcon icon={iconComponent} />
                  </View>
                )}
                <View style={styles.labelContainer}>
                  <Text style={styles.iconLabel}>{iconComponent.label}</Text>
                </View>
              </Pressable>
            </CardWrapper>
          );
        })}
      </ScrollView>
    </View>
  );
}
