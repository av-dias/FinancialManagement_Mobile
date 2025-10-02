import { Pressable, View, Text } from "react-native";
import { verticalScale } from "../../functions/responsive";
import { dark } from "../../utility/colors";
import commonStyles from "../../utility/commonStyles";
import { TypeIcon } from "../TypeIcon/TypeIcon";
import { categoryIcons } from "../../utility/icons";
import { styles } from "./style";
import { BlurText } from "../BlurText/BlurText";

export default function SimpleItem({
  rowData,
  total,
  onPressCallback,
  privacyShield = false,
  blurStyle = {},
}) {
  const categoryIcon = categoryIcons(30).find(
    (category) => category.label === rowData[1]
  );

  const loadPercentage = (part, total) => {
    return ((part / total) * 100).toFixed(0);
  };

  return (
    <Pressable
      key={rowData[1]}
      style={({ pressed }) =>
        commonStyles.onPressBounce(
          pressed,
          styles.mainContainer,
          () => onPressCallback(rowData),
          styles.padding.paddingHorizontal
        )
      }
      onPress={() => onPressCallback(rowData)}
    >
      <View style={styles.containerRow}>
        <TypeIcon
          icon={categoryIcon}
          customStyle={{
            width: verticalScale(40),
          }}
        />
        <View>
          <Text style={{ color: dark.textPrimary }}>{rowData[1]}</Text>
          <Text style={styles.textSmall}>
            {loadPercentage(rowData[2], total)}
            <Text style={styles.textSymbol}>{`%`}</Text>
          </Text>
        </View>
      </View>
      <BlurText
        style={styles.centered}
        blurStyle={blurStyle}
        text={
          <Text>
            <Text style={{ color: dark.textPrimary }}>{rowData[2]}</Text>
            <Text style={styles.textSymbol}>{`€`}</Text>
          </Text>
        }
        privacyShield={privacyShield}
      />
    </Pressable>
  );
}
