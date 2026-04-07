import { useContext } from "react";

import type { UseModesContext } from "@/types/hooks";

import { ModesContext } from "@/contexts/ModesContext/ModesContext";

export const useModesContext = (): UseModesContext => {
  const context = useContext(ModesContext);
  if (!context) throw new Error("useModesContext must be used within ModesProvider");
  return context;
};
