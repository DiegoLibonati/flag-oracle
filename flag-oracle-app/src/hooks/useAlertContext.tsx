import { useContext } from "react";

import type { UseAlertContext } from "@/types/hooks";

import { AlertContext } from "@/contexts/AlertContext/AlertContext";

export const useAlertContext = (): UseAlertContext => {
  const context = useContext(AlertContext);
  if (!context) throw new Error("useAlertContext must be used within AlertProvider");
  return context;
};
