import * as SecureStore from "expo-secure-store";

export async function saveToStorage(key, value, user) {
  if (!user) user = "";
  await SecureStore.setItemAsync(user + key, value);
}

export async function getFromStorage(key, user) {
  if (!user) user = "";
  let result = await SecureStore.getItemAsync(user + key);
  console.log(`%csecureStorage: %c${result}`, "color:#bada55", "color:#bada55");
  return result;
}
