import { createContext, useState, useEffect } from "react";
import { getUser } from "../functions/basic";

export const UserContext = createContext({ email: null });

const UserContextProvider = ({ children }) => {
  const [email, setEmail] = useState();

  useEffect(() => {
    async function fetchUser() {
      let email = await getUser();
      setEmail(email);
    }
    fetchUser();
  }, []);

  const value = {
    email: email,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContextProvider;
