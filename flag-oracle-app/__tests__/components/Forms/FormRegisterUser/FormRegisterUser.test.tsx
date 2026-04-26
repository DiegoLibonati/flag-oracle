import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import type { RenderResult } from "@testing-library/react";

import FormRegisterUser from "@/components/Forms/FormRegisterUser/FormRegisterUser";

import { AlertProvider } from "@/contexts/AlertContext/AlertProvider";
import { GameProvider } from "@/contexts/GameContext/GameProvider";

const mockFetchSuccess = (data: unknown): void => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => await data,
  } as Response);
};

const mockFetchErrorWithBody = (errorBody: unknown): void => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: false,
    json: async () => await errorBody,
  } as Response);
};

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
    it("should render the score", () => {
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
    it("should update username input when user types", async () => {
      renderComponent();
      const user = userEvent.setup();
      const input = screen.getByRole("textbox", { name: "Username" });
      await user.type(input, "testuser");
      expect(input).toHaveValue("testuser");
    });

    it("should update password input when user types", async () => {
      renderComponent();
      const user = userEvent.setup();
      const passwordInput = screen.getByLabelText("Password");
      await user.type(passwordInput, "testpass");
      expect(passwordInput).toHaveValue("testpass");
    });

    it("should call fetch with POST to /api/v1/users/ on submit", async () => {
      mockFetchSuccess({ message: "User created", code: "S001", data: {} });
      renderComponent();
      const user = userEvent.setup();
      await user.type(screen.getByRole("textbox", { name: "Username" }), "testuser");
      await user.type(screen.getByLabelText("Password"), "testpass");
      await user.click(screen.getByRole("button", { name: "Register new user" }));
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          "/api/v1/users/",
          expect.objectContaining({ method: "POST" })
        );
      });
    });

    it("should disable the button after successful submit", async () => {
      mockFetchSuccess({ message: "User created", code: "S001", data: {} });
      renderComponent();
      const user = userEvent.setup();
      await user.type(screen.getByRole("textbox", { name: "Username" }), "testuser");
      await user.type(screen.getByLabelText("Password"), "testpass");
      await user.click(screen.getByRole("button", { name: "Register new user" }));
      await waitFor(() => {
        expect(screen.getByRole("button", { name: "Register new user" })).toBeDisabled();
      });
    });

    it("should disable the button after a failed submit", async () => {
      mockFetchErrorWithBody({ code: "CONFLICT", message: "Username already exists" });
      renderComponent();
      const user = userEvent.setup();
      await user.type(screen.getByRole("textbox", { name: "Username" }), "testuser");
      await user.type(screen.getByLabelText("Password"), "testpass");
      await user.click(screen.getByRole("button", { name: "Register new user" }));
      await waitFor(() => {
        expect(screen.getByRole("button", { name: "Register new user" })).toBeDisabled();
      });
    });

    it("should reset form inputs after successful submit", async () => {
      mockFetchSuccess({ message: "User created", code: "S001", data: {} });
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
