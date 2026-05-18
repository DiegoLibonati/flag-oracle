import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import type { RenderResult } from "@testing-library/react";

import MenuModePage from "@/pages/MenuModePage/MenuModePage";

import { ModeProvider } from "@/contexts/ModeContext/ModeProvider";
import { UsersProvider } from "@/contexts/UsersContext/UsersProvider";

import modeService from "@/services/modeService";

import { mockMode } from "@tests/__mocks__/modes.mock";
import { mockUsersTop } from "@tests/__mocks__/usersTop.mock";

const mockModeService = modeService as jest.Mocked<typeof modeService>;

jest.mock("@/services/modeService", () => ({
  __esModule: true,
  default: {
    getAll: jest.fn(),
    getById: jest.fn(),
    getTopMode: jest.fn(),
  },
}));

const setupSuccessfulFetches = (): void => {
  mockModeService.getTopMode.mockResolvedValue({
    message: "ok",
    code: "SUCCESS_GET_TOP_MODE",
    data: mockUsersTop,
  });
  mockModeService.getById.mockResolvedValue({
    message: "ok",
    code: "SUCCESS_GET_MODE",
    data: mockMode,
  });
};

const renderComponent = (idMode = mockMode._id): RenderResult => {
  return render(
    <MemoryRouter initialEntries={[`/menu/${idMode}`]}>
      <Routes>
        <Route
          path="/menu/:idMode"
          element={
            <ModeProvider>
              <UsersProvider>
                <MenuModePage />
              </UsersProvider>
            </ModeProvider>
          }
        />
      </Routes>
    </MemoryRouter>
  );
};

describe("MenuModePage", () => {
  describe("rendering", () => {
    it("should show a loader while fetching mode", () => {
      mockModeService.getTopMode.mockReturnValue(
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

    it("should render the mode name in the title after loading", async () => {
      setupSuccessfulFetches();
      renderComponent();

      expect(await screen.findByRole("heading", { name: "Normal MODE" })).toBeInTheDocument();
    });

    it("should render the mode description after loading", async () => {
      setupSuccessfulFetches();
      renderComponent();

      expect(await screen.findByText(mockMode.description)).toBeInTheDocument();
    });

    it("should render the play button after loading", async () => {
      setupSuccessfulFetches();
      renderComponent();

      expect(await screen.findByRole("link", { name: "Play Normal mode" })).toBeInTheDocument();
    });

    it("should render the top users list after loading", async () => {
      setupSuccessfulFetches();
      renderComponent();

      expect(await screen.findByRole("heading", { name: "NORMAL TOP USERS" })).toBeInTheDocument();
    });

    it("should render top users data after loading", async () => {
      setupSuccessfulFetches();
      renderComponent();

      expect(await screen.findByText(/TITO with 6925 PTS/)).toBeInTheDocument();
    });

    it("should render the go back link", async () => {
      setupSuccessfulFetches();
      renderComponent();

      await screen.findByRole("heading", { name: "Normal MODE" });
      expect(screen.getByRole("link", { name: "Go back to menu" })).toBeInTheDocument();
    });

    it("should render the play link pointing to the start page", async () => {
      setupSuccessfulFetches();
      renderComponent();

      const playLink = await screen.findByRole("link", { name: "Play Normal mode" });
      expect(playLink).toHaveAttribute("href", `/menu/${mockMode._id}/start`);
    });
  });
});
