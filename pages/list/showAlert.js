import { Alert } from "react-native";
import { KEYS as KEYS_SERIALIZER } from "../../utility/keys";
import { KEYS } from "../../utility/storageKeys";
import { removeFromStorage } from "../../functions/secureStorage";

export default showAlert = (key, array, email, setRefreshTrigger) => {
  let [identifier, id] = key.split(KEYS_SERIALIZER.TOKEN_SEPARATOR);
  let element = identifier == KEYS_SERIALIZER.PURCHASE ? KEYS.PURCHASE : KEYS.TRANSACTION,
    elementArray = array,
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
            if (identifier == KEYS_SERIALIZER.PURCHASE) {
              setRefreshTrigger(KEYS_SERIALIZER.PURCHASE);
            } else if (identifier == KEYS_SERIALIZER.TRANSACTION) {
              setRefreshTrigger(KEYS_SERIALIZER.TRANSACTION);
            }
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
