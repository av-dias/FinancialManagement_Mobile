import { Alert } from "react-native";
import { KEYS as KEYS_SERIALIZER } from "../../utility/keys";
import { getFromStorage, saveToStorage } from "../../functions/secureStorage";

export default showAlert = (key, array, setArray, storageKey, email, setRefreshTrigger, refreshTrigger) => {
  let [identifier, id] = key.split(KEYS_SERIALIZER.TOKEN_SEPARATOR);
  let element = storageKey,
    elementArray = array,
    setElement = setArray.bind(),
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
    body =
      description + `Name: ${elementArray[id].name}\nValue: ${elementArray[id].value}\nType: ${elementArray[id].type}\nDate: ${elementArray[id].dop}`;
  } else if (identifier == KEYS_SERIALIZER.TRANSACTION) {
    title = "Delete Transaction";
    description = "Are you sure you want to remove this transaction permanently?" + "\n\n";
    leftButton = "Yes";
    rightButton = "No";
    body = description + `Description: ${elementArray[id].description}\nAmount: ${elementArray[id].amount}\nDate: ${elementArray[id].dot}`;
  } else if (identifier == KEYS_SERIALIZER.ARCHIVE) {
    title = "Archived Purchase Detail";
    body =
      description + `Name: ${elementArray[id].name}\nValue: ${elementArray[id].value}\nType: ${elementArray[id].type}\nDate: ${elementArray[id].dop}`;
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
            arr = elementArray.filter((item) => item != elementArray[id]);
            await saveToStorage(element, JSON.stringify(arr), email);
            setElement(arr);
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
