import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import type { RenderResult } from "@testing-library/react";

import MenuPage from "@/pages/MenuPage/MenuPage";

import { ModesProvider } from "@/contexts/ModesContext/ModesProvider";

import { mockModes } from "@tests/__mocks__/modes.mock";

const mockFetchSuccess = (data: unknown): void => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => await data,
  } as Response);
};

const mockFetchError = (): void => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: false,
    status: 500,
  } as Response);
};

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
      global.fetch = jest.fn().mockReturnValue(
        new Promise(() => {
          // Empty fn
        })
      );
      renderComponent();
      expect(screen.getByText("", { selector: "span.loader" })).toBeInTheDocument();
    });

    it("should render the page title after loading", async () => {
      mockFetchSuccess({ message: "ok", code: "S001", data: mockModes });
      renderComponent();
      expect(await screen.findByRole("heading", { name: "Choose a MODE" })).toBeInTheDocument();
    });

    it("should render a link for each mode after loading", async () => {
      mockFetchSuccess({ message: "ok", code: "S001", data: mockModes });
      renderComponent();
      await screen.findByRole("heading", { name: "Choose a MODE" });
      expect(screen.getByRole("link", { name: "Play Normal mode" })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Play Hard mode" })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Play Hardcore mode" })).toBeInTheDocument();
    });

    it("should render a go back link", async () => {
      mockFetchSuccess({ message: "ok", code: "S001", data: mockModes });
      renderComponent();
      await screen.findByRole("heading", { name: "Choose a MODE" });
      expect(screen.getByRole("link", { name: "Go back to home" })).toBeInTheDocument();
    });

    it("should render mode links with correct href to mode page", async () => {
      mockFetchSuccess({ message: "ok", code: "S001", data: mockModes });
      renderComponent();
      await screen.findByRole("heading", { name: "Choose a MODE" });
      const normalLink = screen.getByRole("link", { name: "Play Normal mode" });
      expect(normalLink).toHaveAttribute("href", `/menu/${mockModes[0]!._id}`);
    });
  });

  describe("error handling", () => {
    it("should show the title with no modes after a failed fetch", async () => {
      mockFetchError();
      renderComponent();
      expect(await screen.findByRole("heading", { name: "Choose a MODE" })).toBeInTheDocument();
    });
  });
});
