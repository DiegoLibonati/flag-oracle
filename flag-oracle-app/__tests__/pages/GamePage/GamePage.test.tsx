import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import type { RenderResult } from "@testing-library/react";

import GamePage from "@/pages/GamePage/GamePage";

import { FlagsProvider } from "@/contexts/FlagsContext/FlagsProvider";
import { GameProvider } from "@/contexts/GameContext/GameProvider";
import { ModeProvider } from "@/contexts/ModeContext/ModeProvider";

import { mockFlags } from "@tests/__mocks__/flags.mock";
import { mockMode } from "@tests/__mocks__/modes.mock";

const mockFetchBoth = (): void => {
  global.fetch = jest
    .fn()
    .mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: "ok", code: "S001", data: mockFlags }),
    } as Response)
    .mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: "ok", code: "S001", data: mockMode }),
    } as Response);
};

const renderComponent = (idMode = mockMode._id): RenderResult => {
  return render(
    <MemoryRouter initialEntries={[`/menu/${idMode}/game`]}>
      <Routes>
        <Route
          path="/menu/:idMode/game"
          element={
            <FlagsProvider>
              <ModeProvider>
                <GameProvider>
                  <GamePage />
                </GameProvider>
              </ModeProvider>
            </FlagsProvider>
          }
        />
      </Routes>
    </MemoryRouter>
  );
};

describe("GamePage", () => {
  describe("rendering", () => {
    it("should show a loader while fetching data", () => {
      global.fetch = jest.fn().mockReturnValue(
        new Promise(() => {
          // Empty fn
        })
      );
      renderComponent();
      expect(screen.getByText("", { selector: "span.loader" })).toBeInTheDocument();
    });

    it("should render the GUESS THE FLAG heading after loading", async () => {
      mockFetchBoth();
      renderComponent();
      expect(await screen.findByRole("heading", { name: "GUESS THE FLAG" })).toBeInTheDocument();
    });

    it("should render the flag image after loading", async () => {
      mockFetchBoth();
      renderComponent();
      await screen.findByRole("heading", { name: "GUESS THE FLAG" });
      expect(screen.getByRole("img", { name: mockFlags[0]!.name })).toBeInTheDocument();
    });

    it("should render the guess flag input after loading", async () => {
      mockFetchBoth();
      renderComponent();
      await screen.findByRole("heading", { name: "GUESS THE FLAG" });
      expect(screen.getByRole("textbox", { name: "Country name" })).toBeInTheDocument();
    });

    it("should render the score display after loading", async () => {
      mockFetchBoth();
      renderComponent();
      await screen.findByRole("heading", { name: "GUESS THE FLAG" });
      expect(screen.getByText(/Score: 0 PTS/)).toBeInTheDocument();
    });

    it("should render the timer display after loading", async () => {
      mockFetchBoth();
      renderComponent();
      await screen.findByRole("heading", { name: "GUESS THE FLAG" });
      expect(screen.getByText(/Time left:/)).toBeInTheDocument();
    });

    it("should render the flag with src from the first random flag", async () => {
      mockFetchBoth();
      renderComponent();
      await screen.findByRole("heading", { name: "GUESS THE FLAG" });
      const img = screen.getByRole("img");
      expect(img).toHaveAttribute("src", mockFlags[0]!.image);
    });
  });
});
