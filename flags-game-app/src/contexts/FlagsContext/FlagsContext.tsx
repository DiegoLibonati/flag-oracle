import { createContext } from "react";

import type { FlagsContext as FlagsContextT } from "@/types/contexts";

export const FlagsContext = createContext<FlagsContextT | null>(null);
