import { useState } from "react";

import type { JSX } from "react";
import type { UiProviderProps } from "@/types/props";

import { UiContext } from "@/contexts/UiContext/UiContext";

export const UiProvider = ({ children }: UiProviderProps): JSX.Element => {
  const [navbar, setNavbar] = useState(false);

  const handleManageNavbar = (): void => {
    setNavbar(!navbar);
  };

  return (
    <UiContext.Provider
      value={{
        navbar: navbar,
        handleManageNavbar: handleManageNavbar,
      }}
    >
      {children}
    </UiContext.Provider>
  );
};
