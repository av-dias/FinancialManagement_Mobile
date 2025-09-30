import { ScrollView, View } from "react-native";
import { Badge } from "react-native-paper";
import { ExpenseEnum } from "../../models/types";
import { PurchaseEntity } from "../../store/database/Purchase/PurchaseEntity";
import {
  TransactionEntity,
  TransactionOperation,
} from "../../store/database/Transaction/TransactionEntity";
import { utilsColors } from "../../utility/colors";
import { FlatItem } from "../flatItem/flatItem";
import { verticalScale } from "../../functions/responsive";
import { categoryIcons } from "../../utility/icons";
import { TypeIcon } from "../TypeIcon/TypeIcon";

export const ExpenseItem = ({ expenses }) => {
  const loadIcon = (expense: PurchaseEntity | TransactionEntity) => (
    <TypeIcon
      icon={categoryIcons().find((category) => category.label === expense.type)}
      customStyle={{
        width: verticalScale(40),
        borderRadius: 20,
      }}
    />
  );

  return (
    <ScrollView contentContainerStyle={{ gap: 10, paddingTop: 10 }}>
      {expenses.map((expense: PurchaseEntity | TransactionEntity) => (
        <View key={expense.entity + expense.id}>
          {expense.entity === ExpenseEnum.Purchase && expense.split && (
            <Badge
              size={24}
              style={{
                top: -5,
                zIndex: 1,
                position: "absolute",
                backgroundColor: utilsColors.badge,
              }}
            >{`${expense.split.weight}%`}</Badge>
          )}
          <FlatItem
            icon={loadIcon(expense)}
            paddingHorizontal={15}
            paddingVertical={10}
            name={(expense as PurchaseEntity)?.name || expense.type}
            value={
              expense.entity === ExpenseEnum.Transaction &&
              (expense as TransactionEntity).transactionType ===
                TransactionOperation.RECEIVED
                ? Number(-expense.amount)
                : Number(expense.amount)
            }
          />
        </View>
      ))}
    </ScrollView>
  );
};
