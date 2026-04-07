import { useEffect, useState } from "react";

import type { JSX } from "react";
import type { Alert } from "@/types/app";
import type { AlertProviderProps } from "@/types/props";

import { AlertContext } from "@/contexts/AlertContext/AlertContext";

export const AlertProvider = ({ children }: AlertProviderProps): JSX.Element => {
  const [alert, setAlert] = useState<Alert>({
    message: "",
    type: "",
  });

  const handleSetAlert = (alert: Alert): void => {
    setAlert(alert);
  };

  const handleClearAlert = (): void => {
    setAlert({
      type: "",
      message: "",
    });
  };

  useEffect(() => {
    if (!alert.type) return;

    const timeout = setTimeout(() => {
      handleClearAlert();
    }, 2000);

    return (): void => {
      clearTimeout(timeout);
    };
  }, [alert.type]);

  return (
    <AlertContext.Provider
      value={{
        alert: alert,
        handleSetAlert: handleSetAlert,
        handleClearAlert: handleClearAlert,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};
