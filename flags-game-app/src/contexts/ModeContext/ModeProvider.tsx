import { useState } from "react";

import type { JSX } from "react";
import type { Mode } from "@/types/app";
import type { ModeState } from "@/types/states";
import type { ModeProviderProps } from "@/types/props";

import { ModeContext } from "@/contexts/ModeContext/ModeContext";

export const ModeProvider = ({ children }: ModeProviderProps): JSX.Element => {
  const [mode, setMode] = useState<ModeState>({
    mode: null,
    error: null,
    loading: false,
  });

  const handleSetMode = (mode: Mode): void => {
    setMode((state) => ({
      ...state,
      mode: mode,
    }));
  };

  const handleClearMode = (): void => {
    setMode({
      mode: null,
      error: null,
      loading: false,
    });
  };

  const handleStartFetchMode = (): void => {
    setMode((state) => ({
      ...state,
      loading: true,
      error: null,
    }));
  };

  const handleEndFetchMode = (): void => {
    setMode((state) => ({
      ...state,
      loading: false,
    }));
  };

  const handleSetErrorMode = (error: string): void => {
    setMode((state) => ({
      ...state,
      error: error,
    }));
  };

  return (
    <ModeContext.Provider
      value={{
        mode: mode,
        handleClearMode: handleClearMode,
        handleSetMode: handleSetMode,
        handleStartFetchMode: handleStartFetchMode,
        handleEndFetchMode: handleEndFetchMode,
        handleSetErrorMode: handleSetErrorMode,
      }}
    >
      {children}
    </ModeContext.Provider>
  );
};
