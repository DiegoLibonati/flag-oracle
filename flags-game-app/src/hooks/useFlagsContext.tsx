import { useContext } from "react";

import type { UseFlagsContext } from "@/types/hooks";

import { FlagsContext } from "@/contexts/FlagsContext/FlagsContext";

export const useFlagsContext = (): UseFlagsContext => {
  const context = useContext(FlagsContext);
  if (!context) throw new Error("useFlagsContext must be used within FlagsProvider");
  return context;
};
