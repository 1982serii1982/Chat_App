import { createContext, useState } from "react";

export const UserContext = createContext(null);

export const UserContextProvider = ({ children }) => {
  const [userEmail, setUserEmail] = useState(null);
  const [userId, setUserId] = useState(null);

  return (
    <UserContext.Provider
      value={{ userEmail, userId, setUserEmail, setUserId }}
    >
      {children}
    </UserContext.Provider>
  );
};
