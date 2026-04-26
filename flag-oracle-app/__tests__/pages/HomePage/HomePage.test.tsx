import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import type { RenderResult } from "@testing-library/react";

import HomePage from "@/pages/HomePage/HomePage";

import { UsersProvider } from "@/contexts/UsersContext/UsersProvider";

import { mockUsersTop } from "@tests/__mocks__/usersTop.mock";

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
      <UsersProvider>
        <HomePage />
      </UsersProvider>
    </MemoryRouter>
  );
};

describe("HomePage", () => {
  describe("rendering", () => {
    it("should render the play link", async () => {
      mockFetchSuccess({ message: "ok", code: "S001", data: [] });
      renderComponent();
      expect(
        await screen.findByRole("link", { name: "Let's play – go to game modes" })
      ).toBeInTheDocument();
    });

    it("should show a loader while fetching users", () => {
      global.fetch = jest.fn().mockReturnValue(
        new Promise(() => {
          // Empty fn
        })
      );
      renderComponent();
      expect(screen.getByText("", { selector: "span.loader" })).toBeInTheDocument();
    });

    it("should show the global top users list after loading", async () => {
      mockFetchSuccess({ message: "ok", code: "S001", data: mockUsersTop });
      renderComponent();
      expect(await screen.findByRole("heading", { name: "GLOBAL TOP USERS" })).toBeInTheDocument();
    });

    it("should render user stats after loading", async () => {
      mockFetchSuccess({ message: "ok", code: "S001", data: mockUsersTop });
      renderComponent();
      expect(await screen.findByText(/TITO with 6925 PTS/)).toBeInTheDocument();
    });

    it("should render an empty list when no users are returned", async () => {
      mockFetchSuccess({ message: "ok", code: "S001", data: [] });
      renderComponent();
      await screen.findByRole("heading", { name: "GLOBAL TOP USERS" });
      expect(screen.getByRole("list").children).toHaveLength(0);
    });
  });

  describe("error handling", () => {
    it("should show the list after a failed fetch (with no users)", async () => {
      mockFetchError();
      renderComponent();
      expect(await screen.findByRole("heading", { name: "GLOBAL TOP USERS" })).toBeInTheDocument();
      expect(screen.getByRole("list").children).toHaveLength(0);
    });
  });
});
