import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import type { Flag } from "@/types/app";

import GamePage from "@/pages/GamePage/GamePage";

import { useCountdown } from "@/hooks/useCountdown";
import { useFlagsContext } from "@/hooks/useFlagsContext";
import { useModeContext } from "@/hooks/useModeContext";
import { useGameContext } from "@/hooks/useGameContext";

import { mockFlag } from "@tests/__mocks__/flags.mock";
import { mockMode } from "@tests/__mocks__/modes.mock";

interface RenderPage {
  container: HTMLElement;
}

const mockOnCountdownReset = jest.fn();
const mockHandleStartFetchFlags = jest.fn();
const mockHandleEndFetchFlags = jest.fn();
const mockHandleSetErrorFlags = jest.fn();
const mockHandleSetFlags = jest.fn();
const mockHandleClearFlags = jest.fn();
const mockHandleStartFetchMode = jest.fn();
const mockHandleEndFetchMode = jest.fn();
const mockHandleSetErrorMode = jest.fn();
const mockHandleSetMode = jest.fn();
const mockHandleClearMode = jest.fn();
const mockHandleSetScore = jest.fn();
const mockHandleNextFlagToGuess = jest.fn();
const mockHandleSetFlagToGuess = jest.fn();
const mockHandleClearCurrentFlagToGuess = jest.fn();
const mockFetchJson = jest.fn();

jest.mock("@/hooks/useCountdown");
jest.mock("@/hooks/useFlagsContext");
jest.mock("@/hooks/useModeContext");
jest.mock("@/hooks/useGameContext");

const renderPage = (loading = false, currentFlagToGuess: Flag | null = mockFlag): RenderPage => {
  const mockedFetch = fetch as jest.MockedFunction<typeof fetch>;
  mockedFetch.mockResolvedValue({
    ok: true,
    json: mockFetchJson.mockResolvedValue({ message: "", code: "", data: [] }),
  } as unknown as Response);

  (useCountdown as jest.Mock).mockReturnValue({
    timerText: "00:01:30",
    secondsLeft: 90,
    endTime: false,
    onCountdownReset: mockOnCountdownReset,
  });

  (useFlagsContext as jest.Mock).mockReturnValue({
    flags: { flags: [mockFlag] as Flag[], loading, error: null },
    handleStartFetchFlags: mockHandleStartFetchFlags,
    handleEndFetchFlags: mockHandleEndFetchFlags,
    handleSetErrorFlags: mockHandleSetErrorFlags,
    handleSetFlags: mockHandleSetFlags,
    handleClearFlags: mockHandleClearFlags,
  });

  (useModeContext as jest.Mock).mockReturnValue({
    mode: { mode: mockMode, loading: false, error: null },
    handleStartFetchMode: mockHandleStartFetchMode,
    handleEndFetchMode: mockHandleEndFetchMode,
    handleSetErrorMode: mockHandleSetErrorMode,
    handleSetMode: mockHandleSetMode,
    handleClearMode: mockHandleClearMode,
  });

  (useGameContext as jest.Mock).mockReturnValue({
    currentFlagToGuess,
    completeGuess: false,
    score: 0,
    handleSetScore: mockHandleSetScore,
    handleNextFlagToGuess: mockHandleNextFlagToGuess,
    handleSetFlagToGuess: mockHandleSetFlagToGuess,
    handleClearCurrentFlagToGuess: mockHandleClearCurrentFlagToGuess,
  });

  const { container } = render(
    <MemoryRouter initialEntries={[`/menu/${mockMode._id}/game`]}>
      <Routes>
        <Route path="/menu/:idMode/game" element={<GamePage />} />
      </Routes>
    </MemoryRouter>
  );
  return { container };
};

describe("GamePage", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should show the Loader when flags are loading", () => {
    const { container } = renderPage(true, null);
    expect(container.querySelector<HTMLSpanElement>(".loader")).toBeInTheDocument();
  });

  it("should show the Loader when there is no current flag to guess", () => {
    const { container } = renderPage(false, null);
    expect(container.querySelector<HTMLSpanElement>(".loader")).toBeInTheDocument();
  });

  it("should render the game title when data is ready", () => {
    renderPage();
    expect(screen.getByText(/guess the flag/i)).toBeInTheDocument();
  });

  it("should render the flag image", () => {
    renderPage();
    expect(screen.getByRole("img", { name: mockFlag.name })).toBeInTheDocument();
  });

  it("should render the score display", () => {
    renderPage();
    expect(screen.getByText(/score: 0 pts/i)).toBeInTheDocument();
  });

  it("should render the timer", () => {
    renderPage();
    expect(screen.getByText(/time left: 00:01:30/i)).toBeInTheDocument();
  });

  it("should render the guess input form", () => {
    renderPage();
    expect(screen.getByRole("textbox", { name: /country name/i })).toBeInTheDocument();
  });
});
