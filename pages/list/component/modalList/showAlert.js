import { Alert } from "react-native";
import { KEYS as KEYS_SERIALIZER } from "../../../../utility/keys";
import { KEYS } from "../../../../utility/storageKeys";
import { removeFromStorage } from "../../../../functions/secureStorage";
import { deleteExpenses } from "../../../../functions/expenses";

export const handleIncomeDeleteAlert = (income) => {
  Alert.alert("Delete Income", `Are you sure you want to remove this income permanently?\n\nName: ${income.name}\nAmount: ${income.amount}`, [
    {
      text: `Yes`,
      onPress: async () => {
        await incomeRepository.delete(income.id);
        setIncomeData((prev) => prev.filter((item) => item.id !== income.id));
      },
    },
    { text: "No", onPress: () => {}, style: "cancel" },
  ]);
};

export const handleDeleteAlert = (key, expense, email, setExpenses) => {
  let [identifier, id] = key.split(KEYS_SERIALIZER.TOKEN_SEPARATOR);
  let element = identifier == KEYS_SERIALIZER.PURCHASE ? KEYS.PURCHASE : KEYS.TRANSACTION,
    elementArray = expense.element,
    title = "",
    description = "",
    body = `Name: ${elementArray.name}\n`,
    leftButton = "Ok",
    rightButton = "Cancel";
  if (identifier == KEYS_SERIALIZER.PURCHASE) {
    title = "Delete Purchase";
    body = `Name: ${elementArray.name}\n`;
    description = "Are you sure you want to remove this purchase permanently?" + "\n\n" + body;

    leftButton = "Yes";
    rightButton = "No";
  } else if (identifier == KEYS_SERIALIZER.TRANSACTION) {
    title = "Delete Transaction";
    body = `Name: ${elementArray.description}\n`;
    description = "Are you sure you want to remove this transaction permanently?" + "\n\n" + body;

    leftButton = "Yes";
    rightButton = "No";
  } else if (identifier == KEYS_SERIALIZER.ARCHIVE_PURCHASE) {
    title = "Archived Purchase Detail";
  } else if (identifier == KEYS_SERIALIZER.ARCHIVE_TRANSACTION) {
    title = "Archived Transaction Detail";
  } else {
    console.log("error: " + identifier);
  }
  Alert.alert(
    title,
    description,
    [
      {
        text: leftButton,
        onPress: async () => {
          if (identifier == KEYS_SERIALIZER.PURCHASE || identifier == KEYS_SERIALIZER.TRANSACTION) {
            await removeFromStorage(element, id, email);
            deleteExpenses(expense, setExpenses);
          }
        },
        style: "yes",
      },
      {
        text: rightButton,
        onPress: () => {},
        style: "no",
      },
    ],
    {
      cancelable: true,
    }
  );
};
