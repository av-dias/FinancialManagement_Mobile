import { View, StyleSheet } from "react-native";
import { verticalScale } from "../../functions/responsive";
import commonStyles from "../../utility/commonStyles";
import { dark } from "../../utility/colors";
import { ReactNode } from "react";

export const _styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderRadius: verticalScale(10),
    padding: 2,
    aspectRatio: 1,
  },
  innerContainer: { flex: 1, justifyContent: "center", alignContent: "center", borderRadius: verticalScale(8) },
});

type TypeIconProps = {
  icon: any;
};

export const TypeIcon = ({ icon }: TypeIconProps) => {
  const styles = _styles;
  return (
    <View style={{ ...styles.container, borderColor: icon.color }}>
      <View style={{ ...styles.innerContainer, backgroundColor: icon.borderColor }}>{icon.icon}</View>
    </View>
  );
};