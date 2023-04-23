import * as SecureStore from "expo-secure-store";

export async function saveToStorage(key, value) {
  await SecureStore.setItemAsync(key, value);
}

export async function getFromStorage(key) {
  let result = await SecureStore.getItemAsync(key);
  console.log(`%csecureStorage: %c${result}`, "color:#bada55", "color:#bada55");
  return result;
}
