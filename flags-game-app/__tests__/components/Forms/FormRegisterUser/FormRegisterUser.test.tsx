import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import FormRegisterUser from "@/components/Forms/FormRegisterUser/FormRegisterUser";

import { useGameContext } from "@/hooks/useGameContext";
import { useAlertContext } from "@/hooks/useAlertContext";

import { mockMode } from "@tests/__mocks__/modes.mock";

interface RenderComponent {
  container: HTMLElement;
}

const mockHandleSetScore = jest.fn();
const mockHandleSetAlert = jest.fn();
const mockHandleClearAlert = jest.fn();
const mockHandleNextFlagToGuess = jest.fn();
const mockHandleSetFlagToGuess = jest.fn();
const mockHandleClearCurrentFlagToGuess = jest.fn();

jest.mock("@/hooks/useGameContext");
jest.mock("@/hooks/useAlertContext");

const renderComponent = (): RenderComponent => {
  (useGameContext as jest.Mock).mockReturnValue({
    score: 100,
    handleSetScore: mockHandleSetScore,
    currentFlagToGuess: null,
    completeGuess: false,
    handleNextFlagToGuess: mockHandleNextFlagToGuess,
    handleSetFlagToGuess: mockHandleSetFlagToGuess,
    handleClearCurrentFlagToGuess: mockHandleClearCurrentFlagToGuess,
  });

  (useAlertContext as jest.Mock).mockReturnValue({
    alert: { type: "", message: "" },
    handleSetAlert: mockHandleSetAlert,
    handleClearAlert: mockHandleClearAlert,
  });

  const { container } = render(
    <MemoryRouter initialEntries={[`/menu/${mockMode._id}/finishgame`]}>
      <Routes>
        <Route path="/menu/:idMode/finishgame" element={<FormRegisterUser />} />
      </Routes>
    </MemoryRouter>
  );
  return { container };
};

describe("FormRegisterUser", () => {
  const mockedFetch = fetch as jest.MockedFunction<typeof fetch>;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the score display", () => {
    renderComponent();
    expect(screen.getByText(/your score was: 100 pts/i)).toBeInTheDocument();
  });

  it("should render the username and password inputs", () => {
    renderComponent();
    expect(screen.getByRole("textbox", { name: /username/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("should render the submit button", () => {
    renderComponent();
    expect(screen.getByRole("button", { name: /register new user/i })).toBeInTheDocument();
  });

  it("should call handleSetAlert with success on successful registration", async () => {
    const user = userEvent.setup();
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: jest
        .fn()
        .mockResolvedValue({ message: "User created", code: "USER_CREATED", data: {} }),
    } as unknown as Response);

    renderComponent();

    await user.type(screen.getByRole("textbox", { name: /username/i }), "testuser");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /register new user/i }));

    await waitFor(() => {
      expect(mockHandleSetAlert).toHaveBeenCalledWith({
        type: "alert-auth-success",
        message: "User created",
      });
    });
  });

  it("should call handleSetAlert with error on failed registration", async () => {
    const mockFetchJson = jest.fn();

    const user = userEvent.setup();
    mockedFetch.mockResolvedValueOnce({
      ok: false,
      json: mockFetchJson.mockResolvedValue({
        code: "CONFLICT",
        message: "Username already exists",
      }),
    } as unknown as Response);

    renderComponent();

    await user.type(screen.getByRole("textbox", { name: /username/i }), "existinguser");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /register new user/i }));

    await waitFor(() => {
      expect(mockHandleSetAlert).toHaveBeenCalledWith(
        expect.objectContaining({ type: "alert-auth-error" })
      );
    });
  });

  it("should disable the submit button when an alert is active", () => {
    (useAlertContext as jest.Mock).mockReturnValue({
      alert: { type: "alert-auth-success", message: "Done" },
      handleSetAlert: mockHandleSetAlert,
      handleClearAlert: mockHandleClearAlert,
    });

    (useGameContext as jest.Mock).mockReturnValue({
      score: 100,
      handleSetScore: mockHandleSetScore,
      currentFlagToGuess: null,
      completeGuess: false,
      handleNextFlagToGuess: mockHandleNextFlagToGuess,
      handleSetFlagToGuess: mockHandleSetFlagToGuess,
      handleClearCurrentFlagToGuess: mockHandleClearCurrentFlagToGuess,
    });

    render(
      <MemoryRouter initialEntries={[`/menu/${mockMode._id}/finishgame`]}>
        <Routes>
          <Route path="/menu/:idMode/finishgame" element={<FormRegisterUser />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole("button", { name: /register new user/i })).toBeDisabled();
  });
});
