import { Pressable, StyleSheet, View, Text } from "react-native";

// StyleSheet
import { verticalScale } from "../../functions/responsive";
import commonStyles from "../../utility/commonStyles";
import { dark } from "../../utility/colors";
import CardWrapper from "../cardWrapper/cardWrapper";

const _styles = StyleSheet.create({
  button: {
    padding: 10,
    width: "100%",
    backgroundColor: "transparent",
    alignSelf: "center",
  },
  text: { zIndex: 1, fontSize: verticalScale(12), textAlign: "center", backgroundColor: "transparent", alignSelf: "center", color: dark.textPrimary },
  row: { flexDirection: "row", justifyContent: "space-between", borderRadius: commonStyles.borderRadius },
  buttonText: {
    fontSize: verticalScale(12),
    color: dark.textPrimary,
  },
  rowGap: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    borderRadius: commonStyles.borderRadius,
    backgroundColor: "transparent",
  },
});

type FlatItemType = {
  name: string;
  value: number;
};

export const FlatItem = (content: FlatItemType) => {
  return (
    <CardWrapper style={{ padding: 20 }}>
      <Pressable>
        <View style={_styles.row}>
          <View>
            <Text style={_styles.text}>{content.name}</Text>
          </View>
          <View>
            <Text style={_styles.text}>{`${content.value} €`}</Text>
          </View>
        </View>
      </Pressable>
    </CardWrapper>
  );
};
