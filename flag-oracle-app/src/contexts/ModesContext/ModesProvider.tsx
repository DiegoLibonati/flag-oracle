import { useState } from "react";

import type { JSX } from "react";
import type { Mode } from "@/types/app";
import type { ModesState } from "@/types/states";
import type { ModesProviderProps } from "@/types/props";

import { ModesContext } from "@/contexts/ModesContext/ModesContext";

export const ModesProvider = ({ children }: ModesProviderProps): JSX.Element => {
  const [modes, setModes] = useState<ModesState>({
    modes: [],
    error: null,
    loading: false,
  });

  const handleSetModes = (modes: Mode[]): void => {
    setModes((state) => ({
      ...state,
      modes: modes,
    }));
  };

  const handleClearModes = (): void => {
    setModes({
      modes: [],
      error: null,
      loading: false,
    });
  };

  const handleStartFetchModes = (): void => {
    setModes((state) => ({
      ...state,
      loading: true,
      error: null,
    }));
  };

  const handleEndFetchModes = (): void => {
    setModes((state) => ({
      ...state,
      loading: false,
    }));
  };

  const handleSetErrorModes = (error: string): void => {
    setModes((state) => ({
      ...state,
      error: error,
    }));
  };

  return (
    <ModesContext.Provider
      value={{
        modes: modes,
        handleSetModes: handleSetModes,
        handleClearModes: handleClearModes,
        handleStartFetchModes: handleStartFetchModes,
        handleEndFetchModes: handleEndFetchModes,
        handleSetErrorModes: handleSetErrorModes,
      }}
    >
      {children}
    </ModesContext.Provider>
  );
};
