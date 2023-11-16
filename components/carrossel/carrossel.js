import { Text, View, ScrollView, Pressable } from "react-native";
import { _styles } from "./style";
import { horizontalScale, verticalScale, moderateScale, heightTreshold } from "../../functions/responsive";
import CardWrapper from "../cardWrapper/cardWrapper";
import { categoryIcons } from "../../assets/icons";
const BORDER_RADIUS = 10;
import { color } from "../../utility/colors";

export default function Carrossel({ type, setType, size, iconSize }) {
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
        {categoryIcons(iconSize).map((iconComponent) => {
          return (
            <CardWrapper
              key={iconComponent.label}
              style={{ backgroundColor: type == iconComponent.label ? color.secundary : color.complementary, width: size }}
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
                <View style={{ ...styles.categoryIconContainer, backgroundColor: iconComponent.color }}>{iconComponent.icon}</View>
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
