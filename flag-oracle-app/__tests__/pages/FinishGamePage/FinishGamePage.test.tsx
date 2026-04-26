import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import type { RenderResult } from "@testing-library/react";

import FinishGamePage from "@/pages/FinishGamePage/FinishGamePage";

import { AlertProvider } from "@/contexts/AlertContext/AlertProvider";
import { GameProvider } from "@/contexts/GameContext/GameProvider";

const renderComponent = (): RenderResult => {
  return render(
    <MemoryRouter initialEntries={["/menu/mode-123/finishgame"]}>
      <Routes>
        <Route
          path="/menu/:idMode/finishgame"
          element={
            <AlertProvider>
              <GameProvider>
                <FinishGamePage />
              </GameProvider>
            </AlertProvider>
          }
        />
      </Routes>
    </MemoryRouter>
  );
};

describe("FinishGamePage", () => {
  describe("rendering", () => {
    it("should render the alert element", () => {
      renderComponent();
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    it("should render the register form section heading", () => {
      renderComponent();
      expect(screen.getByText("If you DONT have a user register")).toBeInTheDocument();
    });

    it("should render the update form section heading", () => {
      renderComponent();
      expect(screen.getByText("If you HAVE a user register")).toBeInTheDocument();
    });

    it("should render the register user form", () => {
      renderComponent();
      expect(screen.getByRole("button", { name: "Register new user" })).toBeInTheDocument();
    });

    it("should render the update user form", () => {
      renderComponent();
      expect(screen.getByRole("button", { name: "Update existing user" })).toBeInTheDocument();
    });

    it("should render the score in both forms as 0 initially", () => {
      renderComponent();
      const scoreElements = screen.getAllByText("Your score was: 0 PTS");
      expect(scoreElements).toHaveLength(2);
    });

    it("should render two username inputs (one per form)", () => {
      renderComponent();
      expect(screen.getAllByRole("textbox", { name: "Username" })).toHaveLength(2);
    });

    it("should have both submit buttons enabled initially", () => {
      renderComponent();
      expect(screen.getByRole("button", { name: "Register new user" })).not.toBeDisabled();
      expect(screen.getByRole("button", { name: "Update existing user" })).not.toBeDisabled();
    });
  });
});
