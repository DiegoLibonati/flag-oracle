import { createContext } from "react";

import type { UsersContext as UsersContextT } from "@/types/contexts";

export const UsersContext = createContext<UsersContextT | null>(null);
