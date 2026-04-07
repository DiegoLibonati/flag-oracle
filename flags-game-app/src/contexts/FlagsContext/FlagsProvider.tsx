import { useState } from "react";

import type { JSX } from "react";
import type { Flag } from "@/types/app";
import type { FlagsState } from "@/types/states";
import type { FlagsProviderProps } from "@/types/props";

import { FlagsContext } from "@/contexts/FlagsContext/FlagsContext";

export const FlagsProvider = ({ children }: FlagsProviderProps): JSX.Element => {
  const [flags, setFlags] = useState<FlagsState>({
    flags: [],
    error: null,
    loading: false,
  });

  const handleSetFlags = (flags: Flag[]): void => {
    setFlags((state) => ({
      ...state,
      flags: flags,
    }));
  };

  const handleClearFlags = (): void => {
    setFlags({
      flags: [],
      error: null,
      loading: false,
    });
  };

  const handleStartFetchFlags = (): void => {
    setFlags((state) => ({
      ...state,
      loading: true,
      error: null,
    }));
  };

  const handleEndFetchFlags = (): void => {
    setFlags((state) => ({
      ...state,
      loading: false,
    }));
  };

  const handleSetErrorFlags = (error: string): void => {
    setFlags((state) => ({
      ...state,
      error: error,
    }));
  };

  return (
    <FlagsContext.Provider
      value={{
        flags: flags,
        handleSetFlags: handleSetFlags,
        handleClearFlags: handleClearFlags,
        handleStartFetchFlags: handleStartFetchFlags,
        handleEndFetchFlags: handleEndFetchFlags,
        handleSetErrorFlags: handleSetErrorFlags,
      }}
    >
      {children}
    </FlagsContext.Provider>
  );
};
