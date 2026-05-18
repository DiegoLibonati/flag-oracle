import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import type { RenderResult } from "@testing-library/react";

import FormRegisterUser from "@/components/Forms/FormRegisterUser/FormRegisterUser";

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
                <FormRegisterUser />
              </GameProvider>
            </AlertProvider>
          }
        />
      </Routes>
    </MemoryRouter>
  );
};

describe("FormRegisterUser", () => {
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
      expect(screen.getByRole("button", { name: "Register new user" })).toBeInTheDocument();
    });

    it("should have the submit button enabled initially", () => {
      renderComponent();
      expect(screen.getByRole("button", { name: "Register new user" })).not.toBeDisabled();
    });
  });

  describe("behavior", () => {
    it("should update the username input when the user types", async () => {
      renderComponent();
      const user = userEvent.setup();

      const input = screen.getByRole("textbox", { name: "Username" });
      await user.type(input, "testuser");

      expect(input).toHaveValue("testuser");
    });

    it("should update the password input when the user types", async () => {
      renderComponent();
      const user = userEvent.setup();

      const passwordInput = screen.getByLabelText("Password");
      await user.type(passwordInput, "testpass");

      expect(passwordInput).toHaveValue("testpass");
    });

    it("should call userService.add with the form payload on submit", async () => {
      mockUserService.add.mockResolvedValue({
        message: "User created",
        code: "SUCCESS_ADD_USER",
        data: {
          _id: "1",
          username: "testuser",
          password: "hashed",
          total_score: 0,
          scores: {},
        },
      });
      renderComponent();
      const user = userEvent.setup();

      await user.type(screen.getByRole("textbox", { name: "Username" }), "testuser");
      await user.type(screen.getByLabelText("Password"), "testpass");
      await user.click(screen.getByRole("button", { name: "Register new user" }));

      await waitFor(() => {
        expect(mockUserService.add).toHaveBeenCalledWith({
          username: "testuser",
          password: "testpass",
          score: 0,
          mode_id: "mode-123",
        });
      });
    });

    it("should disable the submit button after a successful submit", async () => {
      mockUserService.add.mockResolvedValue({
        message: "User created",
        code: "SUCCESS_ADD_USER",
        data: {
          _id: "1",
          username: "testuser",
          password: "hashed",
          total_score: 0,
          scores: {},
        },
      });
      renderComponent();
      const user = userEvent.setup();

      await user.type(screen.getByRole("textbox", { name: "Username" }), "testuser");
      await user.type(screen.getByLabelText("Password"), "testpass");
      await user.click(screen.getByRole("button", { name: "Register new user" }));

      await waitFor(() => {
        expect(screen.getByRole("button", { name: "Register new user" })).toBeDisabled();
      });
    });

    it("should disable the submit button after a failed submit", async () => {
      mockUserService.add.mockRejectedValue(new Error("Username already exists"));
      renderComponent();
      const user = userEvent.setup();

      await user.type(screen.getByRole("textbox", { name: "Username" }), "testuser");
      await user.type(screen.getByLabelText("Password"), "testpass");
      await user.click(screen.getByRole("button", { name: "Register new user" }));

      await waitFor(() => {
        expect(screen.getByRole("button", { name: "Register new user" })).toBeDisabled();
      });
    });

    it("should reset form inputs after a successful submit", async () => {
      mockUserService.add.mockResolvedValue({
        message: "User created",
        code: "SUCCESS_ADD_USER",
        data: {
          _id: "1",
          username: "testuser",
          password: "hashed",
          total_score: 0,
          scores: {},
        },
      });
      renderComponent();
      const user = userEvent.setup();

      const usernameInput = screen.getByRole("textbox", { name: "Username" });
      await user.type(usernameInput, "testuser");
      await user.click(screen.getByRole("button", { name: "Register new user" }));

      await waitFor(() => {
        expect(usernameInput).toHaveValue("");
      });
    });
  });
});
