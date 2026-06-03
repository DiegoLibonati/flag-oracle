import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";

import type { RenderResult } from "@testing-library/react";

import HomePage from "@/pages/HomePage/HomePage";

import { UsersProvider } from "@/contexts/UsersContext/UsersProvider";

import userService from "@/services/userService";

import { mockUsersTop } from "@tests/__mocks__/usersTop.mock";

const mockUserService = userService as jest.Mocked<typeof userService>;

jest.mock("@/services/userService", () => ({
  __esModule: true,
  default: {
    add: jest.fn(),
    updateByUsername: jest.fn(),
    getTopGeneral: jest.fn(),
  },
}));

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
      mockUserService.getTopGeneral.mockResolvedValue({
        message: "ok",
        code: "SUCCESS_GET_GLOBAL_TOP_USER",
        data: [],
      });
      renderComponent();

      expect(
        await screen.findByRole("link", { name: "Let's play – go to game modes" })
      ).toBeInTheDocument();
    });

    it("should show a loader while fetching users", () => {
      mockUserService.getTopGeneral.mockReturnValue(
        new Promise(() => {
          return;
        })
      );
      const { container } = renderComponent();

      expect(container.querySelector<HTMLSpanElement>("span.loader")).toBeInTheDocument();
    });

    it("should show the global top users list after loading", async () => {
      mockUserService.getTopGeneral.mockResolvedValue({
        message: "ok",
        code: "SUCCESS_GET_GLOBAL_TOP_USER",
        data: mockUsersTop,
      });
      renderComponent();

      expect(await screen.findByRole("heading", { name: "GLOBAL TOP USERS" })).toBeInTheDocument();
    });

    it("should render user stats after loading", async () => {
      mockUserService.getTopGeneral.mockResolvedValue({
        message: "ok",
        code: "SUCCESS_GET_GLOBAL_TOP_USER",
        data: mockUsersTop,
      });
      renderComponent();

      expect(await screen.findByText(/TITO with 6925 PTS/)).toBeInTheDocument();
    });

    it("should render an empty list when no users are returned", async () => {
      mockUserService.getTopGeneral.mockResolvedValue({
        message: "ok",
        code: "SUCCESS_GET_GLOBAL_TOP_USER",
        data: [],
      });
      renderComponent();

      await screen.findByRole("heading", { name: "GLOBAL TOP USERS" });
      expect(screen.getByRole("list").children).toHaveLength(0);
    });
  });

  describe("error handling", () => {
    it("should show an empty users list when the service rejects", async () => {
      mockUserService.getTopGeneral.mockRejectedValue(new Error("HTTP error! status: 500"));
      renderComponent();

      expect(await screen.findByRole("heading", { name: "GLOBAL TOP USERS" })).toBeInTheDocument();
      expect(screen.getByRole("list").children).toHaveLength(0);
    });
  });
});
