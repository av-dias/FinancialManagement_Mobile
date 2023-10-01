import * as SecureStore from "expo-secure-store";

export async function saveToStorage(key, value, user) {
  if (!user) user = "";
  user = user.split("@")[0];
  await SecureStore.setItemAsync(user + key, value);
}

export async function getFromStorage(key, user) {
  if (!user) user = "";
  user = user.split("@")[0];
  let result = await SecureStore.getItemAsync(user + key);
  //console.log(`%csecureStorage: %c${result}`, "color:#bada55", "color:#bada55");
  return result;
}

export async function addToStorage(key, value, user) {
  if (!user) user = "";
  user = user.split("@")[0];
  let oldValue = JSON.parse(await getFromStorage(user + key));
  let newValue = [...oldValue, ...JSON.parse(value)];
  await SecureStore.setItemAsync(user + key, JSON.stringify(newValue));
}
