import { useContext } from "react";

import type { UseModeContext } from "@/types/hooks";

import { ModeContext } from "@/contexts/ModeContext/ModeContext";

export const useModeContext = (): UseModeContext => {
  const context = useContext(ModeContext);
  if (!context) throw new Error("useModeContext must be used within ModeProvider");
  return context;
};
