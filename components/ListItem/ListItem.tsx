import { Pressable, View, Text } from "react-native";
import { dark } from "../../utility/colors";
import commonStyles from "../../utility/commonStyles";
import { _styles } from "./style";
import { TypeIcon } from "../TypeIcon/TypeIcon";
import { categoryIcons, utilIcons } from "../../utility/icons";
import { verticalScale } from "../../functions/responsive";
import { ExpenseEnum } from "../../models/types";
import { Dispatch, SetStateAction } from "react";
import { PurchaseEntity } from "../../store/database/Purchase/PurchaseEntity";
import { IncomeEntity } from "../../store/database/Income/IncomeEntity";
import {
  TransactionEntity,
  TransactionOperation,
} from "../../store/database/Transaction/TransactionEntity";

type ListItemProps = {
  item: PurchaseEntity | TransactionEntity | IncomeEntity;
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

const getValue = (
  item: PurchaseEntity | TransactionEntity | IncomeEntity
): String => {
  let value = item.amount;

  if (item.entity === ExpenseEnum.Purchase && !item.isRefund) {
    value = -value;
  } else if (
    item.entity === ExpenseEnum.Transaction &&
    item.transactionType === TransactionOperation.SENT
  ) {
    value = -value;
  }

  return value > 0 ? `+${value}` : value.toString();
};

export const CustomListItem = ({
  item,
  options,
  label,
  onPress = () => {},
  onLongPress = () => {},
  selected = [],
}: ListItemProps) => {
  const styles = _styles;
  let iconComponent;

  const loadIcon = (
    data: PurchaseEntity | TransactionEntity | IncomeEntity
  ) => {
    if (data.entity === ExpenseEnum.Income)
      return utilIcons(23).find((category) => category.label === data.entity);
    else if (data.entity === ExpenseEnum.Purchase)
      return categoryIcons(30).find((category) => category.label === data.type);
    else if (data.entity === ExpenseEnum.Transaction) {
      if (data.transactionType == TransactionOperation.SENT) {
        return (iconComponent = utilIcons().find(
          (type) => type.label === "Transaction"
        ));
      } else {
        return (iconComponent = utilIcons().find(
          (type) => type.label === "Received"
        ));
      }
    } else {
      throw new Error("Unkown expense entity.");
    }
  };

  const onLongPressHandle = () => {
    onLongPress((prev): any[] => {
      if (prev.includes(item)) return prev.filter((i) => i !== item);
      else return [...prev, item];
    });
  };

  return (
    <Pressable
      key={`${item}`}
      style={({ pressed }) => [
        commonStyles.onPressBounce(pressed, styles.button, onPress, 12),
        {
          backgroundColor: selected.includes(item)
            ? dark.secundary
            : "transparent",
        },
      ]}
      onPress={selected.length < 1 ? onPress : onLongPressHandle}
      onLongPress={onLongPressHandle}
    >
      <View style={styles.rowGap}>
        <View
          style={{
            ...styles.row,
            flex: 1,
            backgroundColor: "transparent",
            height: verticalScale(40),
          }}
        >
          <TypeIcon icon={loadIcon(item)} />
          <View style={{ justifyContent: "center" }}>
            <Text style={styles.titleText}>{getLabel(item)}</Text>
            <Text
              style={{
                ...styles.titleText,
                color:
                  item.entity == ExpenseEnum.Income ||
                  (item?.entity == ExpenseEnum.Transaction &&
                    item.transactionType == TransactionOperation.RECEIVED) ||
                  (item.entity == ExpenseEnum.Purchase && item.isRefund)
                    ? "green"
                    : dark.textExpenses,
              }}
            >
              {getValue(item)}
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
              <Pressable
                key={`${item.id}${option.type}`}
                style={styles.optionBox}
                onPress={option.callback}
              >
                {
                  utilIcons(verticalScale(20)).find(
                    (type) => type.label === option.type
                  ).icon
                }
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </Pressable>
  );
};
