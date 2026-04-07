import type { AlertType } from "@/types/app";

export const parseAlertType = (type: AlertType): string => {
  const alertTypes: Record<AlertType, string> = {
    "alert-auth-error": "alert--error",
    "alert-auth-success": "alert--success",
    "": "unknown",
  };

  return alertTypes[type];
};
