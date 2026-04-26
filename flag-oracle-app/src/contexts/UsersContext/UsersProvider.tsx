import { useState } from "react";

import type { JSX } from "react";
import type { UserTop } from "@/types/app";
import type { TopUsersState } from "@/types/states";
import type { UsersProviderProps } from "@/types/props";

import { UsersContext } from "@/contexts/UsersContext/UsersContext";

export const UsersProvider = ({ children }: UsersProviderProps): JSX.Element => {
  const [topUsers, setTopUsers] = useState<TopUsersState>({
    users: [],
    error: null,
    loading: false,
  });

  const handleSetTopUsers = (users: UserTop[]): void => {
    setTopUsers((state) => ({
      ...state,
      users: users,
    }));
  };

  const handleClearTopUsers = (): void => {
    setTopUsers({ users: [], error: null, loading: false });
  };

  const handleStartFetchUsers = (): void => {
    setTopUsers((state) => ({
      ...state,
      loading: true,
      error: null,
    }));
  };

  const handleEndFetchUsers = (): void => {
    setTopUsers((state) => ({
      ...state,
      loading: false,
    }));
  };

  const handleSetErrorUsers = (error: string): void => {
    setTopUsers((state) => ({
      ...state,
      error: error,
    }));
  };
  return (
    <UsersContext.Provider
      value={{
        topUsers: topUsers,
        handleSetTopUsers: handleSetTopUsers,
        handleClearTopUsers: handleClearTopUsers,
        handleStartFetchUsers: handleStartFetchUsers,
        handleEndFetchUsers: handleEndFetchUsers,
        handleSetErrorUsers: handleSetErrorUsers,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};
