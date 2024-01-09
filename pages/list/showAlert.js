import { Alert } from "react-native";
import { KEYS as KEYS_SERIALIZER } from "../../utility/keys";
import { removeFromStorage } from "../../functions/secureStorage";

export default showAlert = (key, array, storageKey, email, setRefreshTrigger) => {
  let [identifier, id] = key.split(KEYS_SERIALIZER.TOKEN_SEPARATOR);
  let element = storageKey,
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
            setRefreshTrigger((prev) => !prev);
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
