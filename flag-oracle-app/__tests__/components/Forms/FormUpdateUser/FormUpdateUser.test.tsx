import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import type { RenderResult } from "@testing-library/react";

import FormUpdateUser from "@/components/Forms/FormUpdateUser/FormUpdateUser";

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
      expect(screen.getByRole("button", { name: "Update existing user" })).toBeInTheDocument();
    });

    it("should have the submit button enabled initially", () => {
      renderComponent();
      expect(screen.getByRole("button", { name: "Update existing user" })).not.toBeDisabled();
    });
  });

  describe("behavior", () => {
    it("should update username input when user types", async () => {
      renderComponent();
      const user = userEvent.setup();
      const input = screen.getByRole("textbox", { name: "Username" });
      await user.type(input, "existinguser");
      expect(input).toHaveValue("existinguser");
    });

    it("should update password input when user types", async () => {
      renderComponent();
      const user = userEvent.setup();
      const passwordInput = screen.getByLabelText("Password");
      await user.type(passwordInput, "mypassword");
      expect(passwordInput).toHaveValue("mypassword");
    });

    it("should call fetch with PATCH to /api/v1/users/ on submit", async () => {
      mockFetchSuccess({ message: "User updated", code: "S002", data: {} });
      renderComponent();
      const user = userEvent.setup();
      await user.type(screen.getByRole("textbox", { name: "Username" }), "existinguser");
      await user.type(screen.getByLabelText("Password"), "mypassword");
      await user.click(screen.getByRole("button", { name: "Update existing user" }));
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          "/api/v1/users/",
          expect.objectContaining({ method: "PATCH" })
        );
      });
    });

    it("should disable the button after successful submit", async () => {
      mockFetchSuccess({ message: "User updated", code: "S002", data: {} });
      renderComponent();
      const user = userEvent.setup();
      await user.type(screen.getByRole("textbox", { name: "Username" }), "existinguser");
      await user.type(screen.getByLabelText("Password"), "mypassword");
      await user.click(screen.getByRole("button", { name: "Update existing user" }));
      await waitFor(() => {
        expect(screen.getByRole("button", { name: "Update existing user" })).toBeDisabled();
      });
    });

    it("should disable the button after a failed submit", async () => {
      mockFetchErrorWithBody({ code: "AUTH_ERROR", message: "Wrong password" });
      renderComponent();
      const user = userEvent.setup();
      await user.type(screen.getByRole("textbox", { name: "Username" }), "existinguser");
      await user.type(screen.getByLabelText("Password"), "wrongpass");
      await user.click(screen.getByRole("button", { name: "Update existing user" }));
      await waitFor(() => {
        expect(screen.getByRole("button", { name: "Update existing user" })).toBeDisabled();
      });
    });

    it("should reset form inputs after successful submit", async () => {
      mockFetchSuccess({ message: "User updated", code: "S002", data: {} });
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
