import { createContext, useContext, useEffect, useState } from "react";

import { getUser } from "../js/user";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isUserLoading, setIsUserLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const u = await getUser();
        setUser(u || null);
      } finally {
        setIsUserLoading(false);
      }
    }
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, isUserLoading }}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook for convenience
export function useUser() {
  return useContext(UserContext);
}
