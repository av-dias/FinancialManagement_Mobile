import { Text, View, ScrollView, Pressable } from "react-native";
import { _styles } from "./style";
import { horizontalScale, verticalScale, moderateScale, heightTreshold } from "../../functions/responsive";
import CardWrapper from "../cardWrapper/cardWrapper";
import { categoryIcons } from "../../assets/icons";
const BORDER_RADIUS = 10;
import { dark } from "../../utility/colors";
import { ReactNode } from "react";

type CarrosselProps = {
  type: any;
  setType: any;
  size: any;
  iconSize: any;
  items: { label: string; color: string; icon?: ReactNode }[];
};

export default function Carrossel({ type, setType, size, iconSize, items = categoryIcons(iconSize) }: CarrosselProps) {
  const styles = _styles;

  return (
    <View style={{ backgroundColor: "transparent", height: size, borderRadius: BORDER_RADIUS }}>
      <ScrollView
        horizontal={true}
        style={styles.categoryScrollContainer}
        contentContainerStyle={{
          gap: verticalScale(10),
          paddingHorizontal: 1,
        }}
      >
        {items.map((iconComponent) => {
          return (
            <CardWrapper
              key={iconComponent.label}
              style={{ backgroundColor: type == iconComponent.label ? dark.secundary : dark.complementary, width: size }}
            >
              <Pressable
                key={iconComponent.label}
                style={{
                  ...styles.categoryContainer,
                }}
                onPress={() => {
                  setType(iconComponent.label);
                }}
              >
                {iconComponent?.icon && (
                  <View style={{ ...styles.categoryIconContainer, backgroundColor: iconComponent.color }}>{iconComponent.icon}</View>
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
