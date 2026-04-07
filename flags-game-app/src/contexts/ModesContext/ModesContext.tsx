import { createContext } from "react";

import type { ModesContext as ModesContextT } from "@/types/contexts";

export const ModesContext = createContext<ModesContextT | null>(null);
