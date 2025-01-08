import { Pressable, View, Text } from "react-native";
import { dark } from "../../utility/colors";
import commonStyles from "../../utility/commonStyles";
import { _styles } from "./style";
import { TypeIcon } from "../TypeIcon/TypeIcon";
import { categoryIcons, utilIcons } from "../../utility/icons";
import { verticalScale } from "../../functions/responsive";
import { PurchaseType, TransactionType } from "../../models/types";
import { Dispatch, SetStateAction } from "react";

type ListItemProps = {
  id: string;
  innerData: any;
  options: { callback: () => void; type: string }[];
  label?: { text: string };
  onPress?: () => void;
  onLongPress?: Dispatch<SetStateAction<any[]>>;
  selected: any[];
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
  if (innerData.hasOwnProperty("dop")) {
    innerData = innerData as PurchaseType;
    if (innerData.note === "Refund") value = `${innerData.value.toString().replace("-", "+")}€`;
    else value = `-${innerData.value}€`;
  } else if (innerData.hasOwnProperty("dot")) {
    innerData = innerData as TransactionType;
    if (innerData?.user_origin_id == null) value = `-${innerData.amount}€`;
    else value = `+${innerData.amount}€`;
  }

  return value;
};

export const CustomListItem = ({ id, innerData, options, label, onPress = () => {}, onLongPress = () => {}, selected = [] }: ListItemProps) => {
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

  const onLongPressHandle = () => {
    onLongPress((prev): any[] => {
      if (prev.includes(id)) return prev.filter((item) => item !== id);
      else return [...prev, id];
    });
  };

  return (
    <Pressable
      key={`${innerData.id}`}
      style={({ pressed }) => [commonStyles.onPressBounce(pressed, styles.button, onPress, 12), { backgroundColor: selected.includes(id) ? dark.secundary : "transparent" }]}
      onPress={selected.length < 1 ? onPress : onLongPressHandle}
      onLongPress={onLongPressHandle}
    >
      <View style={styles.rowGap}>
        <View style={{ ...styles.row, flex: 1, backgroundColor: "transparent", height: verticalScale(40) }}>
          <TypeIcon icon={loadIcon(innerData)} />
          <View style={{ justifyContent: "center" }}>
            <Text style={styles.titleText}>{getLabel(innerData)}</Text>
            <Text style={{ ...styles.titleText, color: innerData.type == "Income" || innerData?.user_origin_id || innerData?.note == "Refund" ? "green" : dark.textExpenses }}>
              {getValue(innerData)}
            </Text>
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
