import { Navigate, Route, Routes } from "react-router-dom";

import type { JSX } from "react";

import HomePage from "@/pages/HomePage/HomePage";
import GamePage from "@/pages/GamePage/GamePage";
import MenuPage from "@/pages/MenuPage/MenuPage";
import FinishGamePage from "@/pages/FinishGamePage/FinishGamePage";
import StartGamePage from "@/pages/StartGamePage/StartGamePage";
import MenuModePage from "@/pages/MenuModePage/MenuModePage";

import { PublicRoute } from "@/router/PublicRoute";

import { ModesProvider } from "@/contexts/ModesContext/ModesProvider";
import { UsersProvider } from "@/contexts/UsersContext/UsersProvider";
import { ModeProvider } from "@/contexts/ModeContext/ModeProvider";
import { FlagsProvider } from "@/contexts/FlagsContext/FlagsProvider";
import { GameProvider } from "@/contexts/GameContext/GameProvider";

export const FlagOracleRouter = (): JSX.Element => {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route
          path="/"
          element={
            <UsersProvider>
              <HomePage></HomePage>
            </UsersProvider>
          }
        ></Route>

        <Route
          path="/menu"
          element={
            <ModesProvider>
              <MenuPage></MenuPage>
            </ModesProvider>
          }
        ></Route>

        <Route
          path="/menu/:idMode"
          element={
            <ModeProvider>
              <UsersProvider>
                <MenuModePage></MenuModePage>
              </UsersProvider>
            </ModeProvider>
          }
        ></Route>

        <Route path="/menu/:idMode/start" element={<StartGamePage></StartGamePage>}></Route>

        <Route
          path="/menu/:idMode/*"
          element={
            <FlagsProvider>
              <ModeProvider>
                <GameProvider>
                  <Routes>
                    <Route path="game" element={<GamePage />} />
                    <Route path="finishgame" element={<FinishGamePage />} />
                  </Routes>
                </GameProvider>
              </ModeProvider>
            </FlagsProvider>
          }
        ></Route>
      </Route>

      <Route path="/*" element={<Navigate to="/"></Navigate>}></Route>
    </Routes>
  );
};
