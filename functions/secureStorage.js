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
  return result;
}

export async function addToStorage(key, value, user) {
  if (!user) user = "";
  user = user.split("@")[0];
  let oldValueString = await getFromStorage(user + key);
  let oldValue = JSON.parse(oldValueString),
    newValue;

  if (oldValue && oldValue.length != 0) {
    newValue = [...oldValue, ...JSON.parse(value)];
  } else {
    newValue = [...JSON.parse(value)];
  }
  await SecureStore.setItemAsync(user + key, JSON.stringify(newValue));
}

export async function editOnStorage(key, value, index, user) {
  if (!user) user = "";
  user = user.split("@")[0];
  let oldValueString = await getFromStorage(user + key);
  let oldValue = JSON.parse(oldValueString);

  if (oldValue && oldValue.length != 0 && oldValue.length > index) {
    oldValue[index] = JSON.parse(value);
  }
  await SecureStore.setItemAsync(user + key, JSON.stringify(oldValue));
}

export async function removeFromStorage(key, index, user) {
  if (!user) user = "";
  user = user.split("@")[0];
  let oldValueString = await getFromStorage(user + key);
  let oldValue = JSON.parse(oldValueString);
  let newValue = oldValue.filter((value, i) => i != index);

  await SecureStore.setItemAsync(user + key, JSON.stringify(newValue));
}

export async function addOrUpdateOnDateStorage(key, element, user) {
  if (!user) user = "";
  user = user.split("@")[0];
  let oldValueString = await getFromStorage(user + key);
  let oldValue = JSON.parse(oldValueString);
  let newValue = [];

  if (!oldValue || oldValue.length === 0) {
    // Add new item
    newValue.push(element);
  } else {
    let foundIndex = oldValue.findIndex((v) => v.name == element.name && v.month == element.month && v.year == element.year);
    if (foundIndex != -1) {
      // Update existing element
      oldValue[foundIndex] = element;
    } else {
      // Add new element
      oldValue.push(element);
    }
    newValue = oldValue;
  }

  await SecureStore.setItemAsync(user + key, JSON.stringify(newValue));
}
