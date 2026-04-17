import { createContext, useContext, useEffect, useState } from "react";

import { getUser } from "../js/user";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const u = await getUser();
      setUser(u);
    }
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook for convenience
export function useUser() {
  return useContext(UserContext);
}
