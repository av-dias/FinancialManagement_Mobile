import { Pressable, View, Text } from "react-native";
import { dark } from "../../utility/colors";
import commonStyles from "../../utility/commonStyles";
import { _styles } from "./style";
import { TypeIcon } from "../TypeIcon/TypeIcon";
import { categoryIcons, utilIcons } from "../../utility/icons";
import { verticalScale } from "../../functions/responsive";

type ListItemProps = {
  innerData: any;
  options: { callback: () => void; type: string }[];
  label?: { text: string };
  onPress?: () => void;
};

const getLabel = (innerData) => {
  let name = innerData.name || innerData.description;
  if (name?.length > 15) {
    name = name.substring(0, 15);
  }

  return name;
};

const getValue = (innerData: any) => {
  let value: string;
  if (innerData.hasOwnProperty("doi")) value = `+${innerData.amount}€`;
  if (innerData.hasOwnProperty("dop")) value = `-${innerData.value}€`;
  else if (innerData.hasOwnProperty("dot")) value = `${innerData.amount}€`;

  return value;
};

export const CustomListItem = ({ innerData, options, label, onPress = () => {} }: ListItemProps) => {
  const styles = _styles;
  let iconComponent;

  const loadIcon = (data) => {
    if (data.doi) return utilIcons(23).find((category) => category.label === innerData.type);
    if (data.dop) return categoryIcons(30).find((category) => category.label === innerData.type);
    if (data.dot) {
      if (!innerData.user_origin_id) {
        return (iconComponent = utilIcons().find((type) => type.label === "Transaction"));
      } else {
        return (iconComponent = utilIcons().find((type) => type.label === "Received"));
      }
    }
  };

  return (
    <Pressable
      key={`${innerData.id}`}
      style={{
        ...styles.button,
        backgroundColor: dark.complementary,
        borderRadius: commonStyles.borderRadius,
      }}
      onPress={onPress}
    >
      <View style={styles.rowGap}>
        <View style={{ ...styles.row, flex: 1, backgroundColor: "transparent", height: verticalScale(40) }}>
          <TypeIcon icon={loadIcon(innerData)} />
          <View style={{ justifyContent: "center" }}>
            <Text style={styles.titleText}>{getLabel(innerData)}</Text>
            <Text style={{ ...styles.titleText, color: innerData.type == "Income" || innerData?.user_origin_id ? "green" : dark.textExpenses }}>{getValue(innerData)}</Text>
          </View>
        </View>
        <View style={{ ...styles.row, flex: 1 }}>
          <View style={styles.optionsContainer}>
            {label && (
              <View style={styles.optionBox}>
                <Text style={styles.text}>{label.text}</Text>
              </View>
            )}
            {options.map((option) => (
              <Pressable key={`${innerData.id}${option.type}`} style={styles.optionBox} onPress={option.callback}>
                {utilIcons(verticalScale(20)).find((type) => type.label === option.type).icon}
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </Pressable>
  );
};
