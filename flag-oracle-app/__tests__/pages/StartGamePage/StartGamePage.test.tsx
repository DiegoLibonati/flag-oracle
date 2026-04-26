import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import type { RenderResult } from "@testing-library/react";

import StartGamePage from "@/pages/StartGamePage/StartGamePage";

const renderComponent = (idMode = "mode-123"): RenderResult => {
  return render(
    <MemoryRouter initialEntries={[`/menu/${idMode}/start`]}>
      <Routes>
        <Route path="/menu/:idMode/start" element={<StartGamePage />} />
      </Routes>
    </MemoryRouter>
  );
};

describe("StartGamePage", () => {
  describe("rendering", () => {
    it("should render the start game link", () => {
      renderComponent();
      expect(screen.getByRole("link", { name: "Start the game" })).toBeInTheDocument();
    });

    it("should render the go back link", () => {
      renderComponent();
      expect(screen.getByRole("link", { name: "Go back to mode details" })).toBeInTheDocument();
    });

    it("should have start link pointing to the game page", () => {
      renderComponent("mode-123");
      expect(screen.getByRole("link", { name: "Start the game" })).toHaveAttribute(
        "href",
        "/menu/mode-123/game"
      );
    });

    it("should have back link pointing to the mode detail page", () => {
      renderComponent("mode-123");
      expect(screen.getByRole("link", { name: "Go back to mode details" })).toHaveAttribute(
        "href",
        "/menu/mode-123"
      );
    });

    it("should use the idMode param in the start link", () => {
      renderComponent("different-mode-id");
      expect(screen.getByRole("link", { name: "Start the game" })).toHaveAttribute(
        "href",
        "/menu/different-mode-id/game"
      );
    });
  });
});
