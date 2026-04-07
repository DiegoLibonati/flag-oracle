import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import FinishGamePage from "@/pages/FinishGamePage/FinishGamePage";

import { useAlertContext } from "@/hooks/useAlertContext";
import { useGameContext } from "@/hooks/useGameContext";

import { mockMode } from "@tests/__mocks__/modes.mock";

interface RenderPage {
  container: HTMLElement;
}

const mockHandleSetScore = jest.fn();
const mockHandleSetAlert = jest.fn();
const mockHandleClearAlert = jest.fn();
const mockHandleNextFlagToGuess = jest.fn();
const mockHandleSetFlagToGuess = jest.fn();
const mockHandleClearCurrentFlagToGuess = jest.fn();

jest.mock("@/hooks/useAlertContext");
jest.mock("@/hooks/useGameContext");

const renderPage = (alertType = "", alertMessage = ""): RenderPage => {
  (useAlertContext as jest.Mock).mockReturnValue({
    alert: { type: alertType, message: alertMessage },
    handleSetAlert: mockHandleSetAlert,
    handleClearAlert: mockHandleClearAlert,
  });

  (useGameContext as jest.Mock).mockReturnValue({
    score: 0,
    handleSetScore: mockHandleSetScore,
    currentFlagToGuess: null,
    completeGuess: false,
    handleNextFlagToGuess: mockHandleNextFlagToGuess,
    handleSetFlagToGuess: mockHandleSetFlagToGuess,
    handleClearCurrentFlagToGuess: mockHandleClearCurrentFlagToGuess,
  });

  const { container } = render(
    <MemoryRouter initialEntries={[`/menu/${mockMode._id}/finishgame`]}>
      <Routes>
        <Route path="/menu/:idMode/finishgame" element={<FinishGamePage />} />
      </Routes>
    </MemoryRouter>
  );
  return { container };
};

describe("FinishGamePage", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the main element", () => {
    const { container } = renderPage();
    expect(container.querySelector<HTMLElement>("main.finish-game-main")).toBeInTheDocument();
  });

  it("should render the register form title", () => {
    renderPage();
    expect(screen.getByText(/if you dont have a user register/i)).toBeInTheDocument();
  });

  it("should render the update form title", () => {
    renderPage();
    expect(screen.getByText(/if you have a user register/i)).toBeInTheDocument();
  });

  it("should render the register submit button", () => {
    renderPage();
    expect(screen.getByRole("button", { name: /register new user/i })).toBeInTheDocument();
  });

  it("should render the update submit button", () => {
    renderPage();
    expect(screen.getByRole("button", { name: /update existing user/i })).toBeInTheDocument();
  });

  it("should apply the error class to the alert when type is alert-auth-error", () => {
    const { container } = renderPage("alert-auth-error", "Something went wrong");
    expect(container.querySelector<HTMLHeadingElement>(".alert--error")).toBeInTheDocument();
  });

  it("should apply the success class to the alert when type is alert-auth-success", () => {
    const { container } = renderPage("alert-auth-success", "Registered successfully");
    expect(container.querySelector<HTMLHeadingElement>(".alert--success")).toBeInTheDocument();
  });

  it("should display the alert message", () => {
    renderPage("alert-auth-success", "Welcome!");
    expect(screen.getByText("Welcome!")).toBeInTheDocument();
  });

  it("should reset the score on unmount", () => {
    (useAlertContext as jest.Mock).mockReturnValue({
      alert: { type: "", message: "" },
      handleSetAlert: mockHandleSetAlert,
      handleClearAlert: mockHandleClearAlert,
    });
    (useGameContext as jest.Mock).mockReturnValue({
      score: 0,
      handleSetScore: mockHandleSetScore,
      currentFlagToGuess: null,
      completeGuess: false,
      handleNextFlagToGuess: mockHandleNextFlagToGuess,
      handleSetFlagToGuess: mockHandleSetFlagToGuess,
      handleClearCurrentFlagToGuess: mockHandleClearCurrentFlagToGuess,
    });

    const { unmount } = render(
      <MemoryRouter initialEntries={[`/menu/${mockMode._id}/finishgame`]}>
        <Routes>
          <Route path="/menu/:idMode/finishgame" element={<FinishGamePage />} />
        </Routes>
      </MemoryRouter>
    );
    unmount();
    expect(mockHandleSetScore).toHaveBeenCalledWith(0);
  });
});
