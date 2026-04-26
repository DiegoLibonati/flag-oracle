import { useContext } from "react";

import type { UseUsersContext } from "@/types/hooks";

import { UsersContext } from "@/contexts/UsersContext/UsersContext";

export const useUsersContext = (): UseUsersContext => {
  const context = useContext(UsersContext);
  if (!context) throw new Error("useUsersContext must be used within UsersProvider");
  return context;
};
