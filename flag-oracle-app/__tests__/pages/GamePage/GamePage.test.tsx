import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";

import type { RenderResult } from "@testing-library/react";

import GamePage from "@/pages/GamePage/GamePage";

import { FlagsProvider } from "@/contexts/FlagsContext/FlagsProvider";
import { GameProvider } from "@/contexts/GameContext/GameProvider";
import { ModeProvider } from "@/contexts/ModeContext/ModeProvider";

import flagService from "@/services/flagService";
import modeService from "@/services/modeService";

import { mockFlags } from "@tests/__mocks__/flags.mock";
import { mockMode } from "@tests/__mocks__/modes.mock";

const mockFlagService = flagService as jest.Mocked<typeof flagService>;
const mockModeService = modeService as jest.Mocked<typeof modeService>;

jest.mock("@/services/flagService", () => ({
  __esModule: true,
  default: {
    getAll: jest.fn(),
    getRandoms: jest.fn(),
  },
}));

jest.mock("@/services/modeService", () => ({
  __esModule: true,
  default: {
    getAll: jest.fn(),
    getById: jest.fn(),
    getTopMode: jest.fn(),
  },
}));

const setupSuccessfulFetches = (): void => {
  mockFlagService.getRandoms.mockResolvedValue({
    message: "ok",
    code: "SUCCESS_GET_ALL_FLAGS",
    data: mockFlags,
  });
  mockModeService.getById.mockResolvedValue({
    message: "ok",
    code: "SUCCESS_GET_MODE",
    data: mockMode,
  });
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
      mockFlagService.getRandoms.mockReturnValue(
        new Promise(() => {
          return;
        })
      );
      mockModeService.getById.mockReturnValue(
        new Promise(() => {
          return;
        })
      );
      const { container } = renderComponent();

      expect(container.querySelector<HTMLSpanElement>("span.loader")).toBeInTheDocument();
    });

    it("should render the GUESS THE FLAG heading after loading", async () => {
      setupSuccessfulFetches();
      renderComponent();

      expect(await screen.findByRole("heading", { name: "GUESS THE FLAG" })).toBeInTheDocument();
    });

    it("should render the flag image after loading", async () => {
      setupSuccessfulFetches();
      renderComponent();

      await screen.findByRole("heading", { name: "GUESS THE FLAG" });
      expect(screen.getByRole("img", { name: mockFlags[0]!.name })).toBeInTheDocument();
    });

    it("should render the guess flag input after loading", async () => {
      setupSuccessfulFetches();
      renderComponent();

      await screen.findByRole("heading", { name: "GUESS THE FLAG" });
      expect(screen.getByRole("textbox", { name: "Country name" })).toBeInTheDocument();
    });

    it("should render the score display after loading", async () => {
      setupSuccessfulFetches();
      renderComponent();

      await screen.findByRole("heading", { name: "GUESS THE FLAG" });
      expect(screen.getByText(/Score: 0 PTS/)).toBeInTheDocument();
    });

    it("should render the timer display after loading", async () => {
      setupSuccessfulFetches();
      renderComponent();

      await screen.findByRole("heading", { name: "GUESS THE FLAG" });
      expect(screen.getByText(/Time left:/)).toBeInTheDocument();
    });

    it("should render the flag with src from the first random flag", async () => {
      setupSuccessfulFetches();
      renderComponent();

      await screen.findByRole("heading", { name: "GUESS THE FLAG" });
      const img = screen.getByRole("img");
      expect(img).toHaveAttribute("src", mockFlags[0]!.image);
    });
  });
});
