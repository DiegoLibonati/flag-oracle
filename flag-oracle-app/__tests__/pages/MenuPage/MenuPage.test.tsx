import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import type { RenderResult } from "@testing-library/react";

import MenuPage from "@/pages/MenuPage/MenuPage";

import { ModesProvider } from "@/contexts/ModesContext/ModesProvider";

import modeService from "@/services/modeService";

import { mockModes } from "@tests/__mocks__/modes.mock";

const mockModeService = modeService as jest.Mocked<typeof modeService>;

jest.mock("@/services/modeService", () => ({
  __esModule: true,
  default: {
    getAll: jest.fn(),
    getById: jest.fn(),
    getTopMode: jest.fn(),
  },
}));

const renderComponent = (): RenderResult => {
  return render(
    <MemoryRouter>
      <ModesProvider>
        <MenuPage />
      </ModesProvider>
    </MemoryRouter>
  );
};

describe("MenuPage", () => {
  describe("rendering", () => {
    it("should show a loader while fetching modes", () => {
      mockModeService.getAll.mockReturnValue(
        new Promise(() => {
          return;
        })
      );
      const { container } = renderComponent();

      expect(container.querySelector<HTMLSpanElement>("span.loader")).toBeInTheDocument();
    });

    it("should render the page title after loading", async () => {
      mockModeService.getAll.mockResolvedValue({
        message: "ok",
        code: "SUCCESS_GET_ALL_MODES",
        data: mockModes,
      });
      renderComponent();

      expect(await screen.findByRole("heading", { name: "Choose a MODE" })).toBeInTheDocument();
    });

    it("should render a link for each mode after loading", async () => {
      mockModeService.getAll.mockResolvedValue({
        message: "ok",
        code: "SUCCESS_GET_ALL_MODES",
        data: mockModes,
      });
      renderComponent();

      await screen.findByRole("heading", { name: "Choose a MODE" });
      expect(screen.getByRole("link", { name: "Play Normal mode" })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Play Hard mode" })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Play Hardcore mode" })).toBeInTheDocument();
    });

    it("should render the go back link", async () => {
      mockModeService.getAll.mockResolvedValue({
        message: "ok",
        code: "SUCCESS_GET_ALL_MODES",
        data: mockModes,
      });
      renderComponent();

      await screen.findByRole("heading", { name: "Choose a MODE" });
      expect(screen.getByRole("link", { name: "Go back to home" })).toBeInTheDocument();
    });

    it("should render mode links with the correct href to the mode page", async () => {
      mockModeService.getAll.mockResolvedValue({
        message: "ok",
        code: "SUCCESS_GET_ALL_MODES",
        data: mockModes,
      });
      renderComponent();

      await screen.findByRole("heading", { name: "Choose a MODE" });
      const normalLink = screen.getByRole("link", { name: "Play Normal mode" });
      expect(normalLink).toHaveAttribute("href", `/menu/${mockModes[0]!._id}`);
    });
  });

  describe("error handling", () => {
    it("should show the title with no modes when the service rejects", async () => {
      mockModeService.getAll.mockRejectedValue(new Error("HTTP error! status: 500"));
      renderComponent();

      expect(await screen.findByRole("heading", { name: "Choose a MODE" })).toBeInTheDocument();
    });
  });
});
