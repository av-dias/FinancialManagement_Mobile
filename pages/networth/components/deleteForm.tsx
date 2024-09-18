import { Alert } from "react-native";

export const deleteForm = (onConfirmCallback, name, value) => {
  Alert.alert(
    "Delete Portfolio Item",
    `Are you sure you want to delete this portfolio item?\n\nName: ${name}\nValue: ${value}`,
    [
      {
        text: "Cancel",
      },
      {
        text: "Delete",
        onPress: async () => {
          await onConfirmCallback();
        },
      },
    ],
    {
      cancelable: true,
    }
  );
};
