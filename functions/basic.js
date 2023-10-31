import { getFromStorage } from "./secureStorage";

export const getUser = async () => {
  try {
    const email = await getFromStorage("email");
    return email;
  } catch (err) {
    console.log("Basic: " + err);
  }
};

export const getServerStatus = async () => {
  try {
    const serverStatus = await getFromStorage("server");
    return serverStatus;
  } catch (err) {
    console.log("Basic: " + err);
  }
};
