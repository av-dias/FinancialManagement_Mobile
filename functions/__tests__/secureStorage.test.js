import * as SecureStore from "expo-secure-store";
import { saveToStorage, getFromStorage, addToStorage } from "../secureStorage";

jest.mock("expo-secure-store", () => {
  return {
    setItemAsync: jest.fn(),
    getItemAsync: jest.fn(),
  };
});

describe("Secure Storage Functions", () => {
  test("saveToStorage should store a value in SecureStore", async () => {
    await saveToStorage("key", "value", "user1@gmail.com");
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith("user1key", "value");
  });

  test("saveToStorage should use the default user if no user is provided", async () => {
    await saveToStorage("key", "value");
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith("key", "value");
  });

  test("getFromStorage should retrieve a value from SecureStore", async () => {
    SecureStore.getItemAsync.mockReturnValue(Promise.resolve("storedValue"));
    const result = await getFromStorage("key", "user1@gmail.com");
    expect(result).toEqual("storedValue");
  });

  test("addToStorage should add an item to an existing array in SecureStore", async () => {
    SecureStore.getItemAsync.mockReturnValue(Promise.resolve(JSON.stringify(["item1"])));
    await addToStorage("key", JSON.stringify(["item2"]), "user1@gmail.com");
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith("user1key", JSON.stringify(["item1", "item2"]));
  });

  test("addToStorage should create a new array if no array exists in SecureStore", async () => {
    SecureStore.getItemAsync.mockReturnValue(Promise.resolve(null));
    await addToStorage("key", JSON.stringify(["item1"]), "user1@gmail.com");
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith("user1key", JSON.stringify(["item1"]));
  });
});
