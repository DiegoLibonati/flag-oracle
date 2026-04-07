import { createContext } from "react";

import type { ModeContext as ModeContextT } from "@/types/contexts";

export const ModeContext = createContext<ModeContextT | null>(null);
