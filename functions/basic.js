import { getFromStorage } from "./secureStorage";

export const getUser = async () => {
  try {
    const email = await getFromStorage("email");
    return email;
  } catch (err) {
    console.log("Basic: " + err);
  }
};
