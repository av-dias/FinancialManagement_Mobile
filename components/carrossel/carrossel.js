import { Text, View, ScrollView, Pressable } from "react-native";
import { _styles } from "./style";
import { horizontalScale, verticalScale, moderateScale, heightTreshold } from "../../functions/responsive";
import CardWrapper from "../cardWrapper/cardWrapper";
import { categoryIcons } from "../../assets/icons";
const BORDER_RADIUS = 10;
import { color } from "../../utility/colors";

export default function Carrossel({ type, setType, handlePress }) {
  const styles = _styles;

  return (
    <View style={{ backgroundColor: "transparent", height: "15%", maxHeight: 100, borderRadius: BORDER_RADIUS }}>
      <ScrollView
        horizontal={true}
        rowGap={20}
        style={styles.categoryScrollContainer}
        contentContainerStyle={{
          gap: verticalScale(10),
          paddingHorizontal: 1,
          paddingVertical: 10,
        }}
      >
        {categoryIcons().map((iconComponent) => {
          return (
            <CardWrapper key={iconComponent.label} style={{ backgroundColor: type == iconComponent.label ? color.secundary : color.complementary }}>
              <Pressable
                key={iconComponent.label}
                style={{
                  ...styles.categoryContainer,
                }}
                onPress={() => {
                  setType(iconComponent.label);
                  handlePress();
                }}
              >
                <View style={styles.categoryIconContainer}>{iconComponent.icon}</View>
                <Text style={styles.iconLabel}>{iconComponent.label}</Text>
              </Pressable>
            </CardWrapper>
          );
        })}
      </ScrollView>
    </View>
  );
}
