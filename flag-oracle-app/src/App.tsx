import { HashRouter } from "react-router-dom";

import type { JSX } from "react";

import { FlagOracleRouter } from "@/router/FlagOracleRouter";

import { AlertProvider } from "@/contexts/AlertContext/AlertProvider";
import { UiProvider } from "@/contexts/UiContext/UiProvider";

function App(): JSX.Element {
  return (
    <HashRouter>
      <AlertProvider>
        <UiProvider>
          <FlagOracleRouter></FlagOracleRouter>
        </UiProvider>
      </AlertProvider>
    </HashRouter>
  );
}

export default App;
