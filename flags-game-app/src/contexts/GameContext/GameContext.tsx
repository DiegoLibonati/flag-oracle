import { createContext } from "react";

import type { GameContext as GameContextT } from "@/types/contexts";

export const GameContext = createContext<GameContextT | null>(null);
