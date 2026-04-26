import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import type { RenderResult } from "@testing-library/react";

import MenuModePage from "@/pages/MenuModePage/MenuModePage";

import { ModeProvider } from "@/contexts/ModeContext/ModeProvider";
import { UsersProvider } from "@/contexts/UsersContext/UsersProvider";

import { mockMode } from "@tests/__mocks__/modes.mock";
import { mockUsersTop } from "@tests/__mocks__/usersTop.mock";

const mockFetchBoth = (): void => {
  global.fetch = jest
    .fn()
    .mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: "ok", code: "S001", data: mockUsersTop }),
    } as Response)
    .mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: "ok", code: "S001", data: mockMode }),
    } as Response);
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
      global.fetch = jest.fn().mockReturnValue(
        new Promise(() => {
          // Empty fn
        })
      );
      renderComponent();
      expect(screen.getByText("", { selector: "span.loader" })).toBeInTheDocument();
    });

    it("should render the mode name in the title after loading", async () => {
      mockFetchBoth();
      renderComponent();
      expect(await screen.findByRole("heading", { name: "Normal MODE" })).toBeInTheDocument();
    });

    it("should render the mode description after loading", async () => {
      mockFetchBoth();
      renderComponent();
      expect(await screen.findByText(mockMode.description)).toBeInTheDocument();
    });

    it("should render the play button after loading", async () => {
      mockFetchBoth();
      renderComponent();
      expect(await screen.findByRole("link", { name: "Play Normal mode" })).toBeInTheDocument();
    });

    it("should render the top users list after loading", async () => {
      mockFetchBoth();
      renderComponent();
      expect(await screen.findByRole("heading", { name: "NORMAL TOP USERS" })).toBeInTheDocument();
    });

    it("should render top users data after loading", async () => {
      mockFetchBoth();
      renderComponent();
      expect(await screen.findByText(/TITO with 6925 PTS/)).toBeInTheDocument();
    });

    it("should render the go back link", async () => {
      mockFetchBoth();
      renderComponent();
      await screen.findByRole("heading", { name: "Normal MODE" });
      expect(screen.getByRole("link", { name: "Go back to menu" })).toBeInTheDocument();
    });

    it("should render the play link pointing to start page", async () => {
      mockFetchBoth();
      renderComponent();
      const playLink = await screen.findByRole("link", { name: "Play Normal mode" });
      expect(playLink).toHaveAttribute("href", `/menu/${mockMode._id}/start`);
    });
  });

  describe("loading state", () => {
    it("should show loader while fetches are pending", () => {
      global.fetch = jest.fn().mockReturnValue(
        new Promise(() => {
          // Empty fn
        })
      );
      renderComponent();
      expect(screen.getByText("", { selector: "span.loader" })).toBeInTheDocument();
    });
  });
});
