import { createContext, useState, useEffect } from "react";
import { getUser } from "../functions/basic";

interface UserContext {
  email: any;
  privacyShield: {
    privacyShield: boolean;
    setPrivacyShield: React.Dispatch<React.SetStateAction<boolean>>;
  };
}

export const UserContext = createContext<UserContext>({
  email: null,
  privacyShield: { privacyShield: false, setPrivacyShield: () => {} },
});

const UserContextProvider = ({ children }) => {
  const [email, setEmail] = useState("");
  const [privacyShield, setPrivacyShield] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      let email = await getUser();
      setEmail(email);
    }
    fetchUser();
  }, []);

  const value = {
    email: email,
    privacyShield: { privacyShield, setPrivacyShield },
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContextProvider;
