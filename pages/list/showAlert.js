import { Alert } from "react-native";
import { KEYS as KEYS_SERIALIZER } from "../../utility/keys";
import { removeFromStorage } from "../../functions/secureStorage";

export default showAlert = (key, array, storageKey, email, setRefreshTrigger, refreshTrigger) => {
  let [identifier, id] = key.split(KEYS_SERIALIZER.TOKEN_SEPARATOR);
  let element = storageKey,
    elementArray = array,
    title = "",
    description = "",
    body = "",
    leftButton = "Ok",
    rightButton = "Cancel";

  if (identifier == KEYS_SERIALIZER.PURCHASE) {
    title = "Delete Purchase";
    description = "Are you sure you want to remove this purchase permanently?" + "\n\n";
    leftButton = "Yes";
    rightButton = "No";
    body = description + `Name: ${elementArray.name}\nValue: ${elementArray.value}\nType: ${elementArray.type}\nDate: ${elementArray.dop}`;
  } else if (identifier == KEYS_SERIALIZER.TRANSACTION) {
    title = "Delete Transaction";
    description = "Are you sure you want to remove this transaction permanently?" + "\n\n";
    leftButton = "Yes";
    rightButton = "No";
    body = description + `Description: ${elementArray.description}\nAmount: ${elementArray.amount}\nDate: ${elementArray.dot}`;
  } else if (identifier == KEYS_SERIALIZER.ARCHIVE_PURCHASE) {
    title = "Archived Purchase Detail";
    body = description + `Name: ${elementArray.name}\nValue: ${elementArray.value}\nType: ${elementArray.type}\nDate: ${elementArray.dop}`;
  } else if (identifier == KEYS_SERIALIZER.ARCHIVE_TRANSACTION) {
    title = "Archived Transaction Detail";
    body = description + `Description: ${elementArray.description}\nAmount: ${elementArray.amount}\nDate: ${elementArray.dot}`;
  } else {
    console.log("error: " + identifier);
  }

  Alert.alert(
    title,
    body,
    [
      {
        text: leftButton,
        onPress: async () => {
          if (identifier == KEYS_SERIALIZER.PURCHASE || identifier == KEYS_SERIALIZER.TRANSACTION) {
            await removeFromStorage(element, id, email);
            setRefreshTrigger(!refreshTrigger);
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
