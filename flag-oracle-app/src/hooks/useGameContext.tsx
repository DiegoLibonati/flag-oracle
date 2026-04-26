import { useContext } from "react";

import type { UseGameContext } from "@/types/hooks";

import { GameContext } from "@/contexts/GameContext/GameContext";

export const useGameContext = (): UseGameContext => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGameContext must be used within GameProvider");
  return context;
};
