"use client";

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

//1.
type userContextType = {
  comment: string;
  setComment: Dispatch<SetStateAction<string>>;
};

//2.
const userContext = createContext({} as userContextType);

//4.
export function useUserContext() {
  return useContext(userContext);
}

export function ContextProvider({ children }: { children: React.ReactNode }) {
  // 3.
  const [comment, setComment] = useState("");

  return (
    //5.
    //6.
    <userContext.Provider value={{ comment, setComment }}>
      {children}
    </userContext.Provider>
  );
}
