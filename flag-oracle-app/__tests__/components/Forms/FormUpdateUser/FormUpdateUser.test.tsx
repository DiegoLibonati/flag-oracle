import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router";

import type { RenderResult } from "@testing-library/react";

import FormUpdateUser from "@/components/Forms/FormUpdateUser/FormUpdateUser";

import { AlertProvider } from "@/contexts/AlertContext/AlertProvider";
import { GameProvider } from "@/contexts/GameContext/GameProvider";

import userService from "@/services/userService";

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
    <MemoryRouter initialEntries={["/menu/mode-123/finishgame"]}>
      <Routes>
        <Route
          path="/menu/:idMode/finishgame"
          element={
            <AlertProvider>
              <GameProvider>
                <FormUpdateUser />
              </GameProvider>
            </AlertProvider>
          }
        />
      </Routes>
    </MemoryRouter>
  );
};

describe("FormUpdateUser", () => {
  describe("rendering", () => {
    it("should render the score as 0 initially", () => {
      renderComponent();
      expect(screen.getByText("Your score was: 0 PTS")).toBeInTheDocument();
    });

    it("should render the username input", () => {
      renderComponent();
      expect(screen.getByRole("textbox", { name: "Username" })).toBeInTheDocument();
    });

    it("should render the password input", () => {
      renderComponent();
      expect(screen.getByLabelText("Password")).toBeInTheDocument();
    });

    it("should render the submit button", () => {
      renderComponent();
      expect(screen.getByRole("button", { name: "Update existing user" })).toBeInTheDocument();
    });

    it("should have the submit button enabled initially", () => {
      renderComponent();
      expect(screen.getByRole("button", { name: "Update existing user" })).not.toBeDisabled();
    });
  });

  describe("behavior", () => {
    it("should update the username input when the user types", async () => {
      renderComponent();
      const user = userEvent.setup();

      const input = screen.getByRole("textbox", { name: "Username" });
      await user.type(input, "existinguser");

      expect(input).toHaveValue("existinguser");
    });

    it("should update the password input when the user types", async () => {
      renderComponent();
      const user = userEvent.setup();

      const passwordInput = screen.getByLabelText("Password");
      await user.type(passwordInput, "mypassword");

      expect(passwordInput).toHaveValue("mypassword");
    });

    it("should call userService.updateByUsername with the form payload on submit", async () => {
      mockUserService.updateByUsername.mockResolvedValue({
        message: "User updated",
        code: "SUCCESS_UPDATE_USER",
        data: {
          _id: "1",
          username: "existinguser",
          password: "hashed",
          total_score: 0,
          scores: {},
        },
      });
      renderComponent();
      const user = userEvent.setup();

      await user.type(screen.getByRole("textbox", { name: "Username" }), "existinguser");
      await user.type(screen.getByLabelText("Password"), "mypassword");
      await user.click(screen.getByRole("button", { name: "Update existing user" }));

      await waitFor(() => {
        expect(mockUserService.updateByUsername).toHaveBeenCalledWith({
          username: "existinguser",
          password: "mypassword",
          score: 0,
          mode_id: "mode-123",
        });
      });
    });

    it("should disable the submit button after a successful submit", async () => {
      mockUserService.updateByUsername.mockResolvedValue({
        message: "User updated",
        code: "SUCCESS_UPDATE_USER",
        data: {
          _id: "1",
          username: "existinguser",
          password: "hashed",
          total_score: 0,
          scores: {},
        },
      });
      renderComponent();
      const user = userEvent.setup();

      await user.type(screen.getByRole("textbox", { name: "Username" }), "existinguser");
      await user.type(screen.getByLabelText("Password"), "mypassword");
      await user.click(screen.getByRole("button", { name: "Update existing user" }));

      await waitFor(() => {
        expect(screen.getByRole("button", { name: "Update existing user" })).toBeDisabled();
      });
    });

    it("should disable the submit button after a failed submit", async () => {
      mockUserService.updateByUsername.mockRejectedValue(new Error("Wrong password"));
      renderComponent();
      const user = userEvent.setup();

      await user.type(screen.getByRole("textbox", { name: "Username" }), "existinguser");
      await user.type(screen.getByLabelText("Password"), "wrongpass");
      await user.click(screen.getByRole("button", { name: "Update existing user" }));

      await waitFor(() => {
        expect(screen.getByRole("button", { name: "Update existing user" })).toBeDisabled();
      });
    });

    it("should reset form inputs after a successful submit", async () => {
      mockUserService.updateByUsername.mockResolvedValue({
        message: "User updated",
        code: "SUCCESS_UPDATE_USER",
        data: {
          _id: "1",
          username: "existinguser",
          password: "hashed",
          total_score: 0,
          scores: {},
        },
      });
      renderComponent();
      const user = userEvent.setup();

      const usernameInput = screen.getByRole("textbox", { name: "Username" });
      await user.type(usernameInput, "existinguser");
      await user.click(screen.getByRole("button", { name: "Update existing user" }));

      await waitFor(() => {
        expect(usernameInput).toHaveValue("");
      });
    });
  });
});
