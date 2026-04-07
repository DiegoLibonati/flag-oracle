import { HashRouter } from "react-router-dom";

import type { JSX } from "react";

import { FlagsGameRouter } from "@/router/FlagsGameRouter";

import { AlertProvider } from "@/contexts/AlertContext/AlertProvider";
import { UiProvider } from "@/contexts/UiContext/UiProvider";

function App(): JSX.Element {
  return (
    <HashRouter>
      <AlertProvider>
        <UiProvider>
          <FlagsGameRouter></FlagsGameRouter>
        </UiProvider>
      </AlertProvider>
    </HashRouter>
  );
}

export default App;
