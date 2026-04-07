import { createContext } from "react";

import type { AlertContext as AlertContextT } from "@/types/contexts";

export const AlertContext = createContext<AlertContextT | null>(null);
