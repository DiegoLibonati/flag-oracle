import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { Flag } from "@/types/app";
import type { FormGuessFlagProps } from "@/types/props";

import FormGuessFlag from "@/components/Forms/FormGuessFlag/FormGuessFlag";

import { useGameContext } from "@/hooks/useGameContext";
import { useModeContext } from "@/hooks/useModeContext";
import { useFlagsContext } from "@/hooks/useFlagsContext";

import { mockFlag } from "@tests/__mocks__/flags.mock";
import { mockMode } from "@tests/__mocks__/modes.mock";

interface RenderComponent {
  container: HTMLElement;
  props: FormGuessFlagProps;
}

const mockHandleSetScore = jest.fn();
const mockHandleNextFlagToGuess = jest.fn();
const mockHandleSetFlagToGuess = jest.fn();
const mockHandleClearCurrentFlagToGuess = jest.fn();
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

jest.mock("@/hooks/useGameContext");
jest.mock("@/hooks/useModeContext");
jest.mock("@/hooks/useFlagsContext");

const renderComponent = (overrides?: Partial<FormGuessFlagProps>): RenderComponent => {
  const props: FormGuessFlagProps = {
    secondsLeft: 30,
    ...overrides,
  };

  (useGameContext as jest.Mock).mockReturnValue({
    currentFlagToGuess: mockFlag,
    completeGuess: false,
    score: 0,
    handleSetScore: mockHandleSetScore,
    handleNextFlagToGuess: mockHandleNextFlagToGuess,
    handleSetFlagToGuess: mockHandleSetFlagToGuess,
    handleClearCurrentFlagToGuess: mockHandleClearCurrentFlagToGuess,
  });

  (useModeContext as jest.Mock).mockReturnValue({
    mode: { mode: mockMode, loading: false, error: null },
    handleStartFetchMode: mockHandleStartFetchMode,
    handleEndFetchMode: mockHandleEndFetchMode,
    handleSetErrorMode: mockHandleSetErrorMode,
    handleSetMode: mockHandleSetMode,
    handleClearMode: mockHandleClearMode,
  });

  (useFlagsContext as jest.Mock).mockReturnValue({
    flags: { flags: [mockFlag] as Flag[], loading: false, error: null },
    handleStartFetchFlags: mockHandleStartFetchFlags,
    handleEndFetchFlags: mockHandleEndFetchFlags,
    handleSetErrorFlags: mockHandleSetErrorFlags,
    handleSetFlags: mockHandleSetFlags,
    handleClearFlags: mockHandleClearFlags,
  });

  const { container } = render(<FormGuessFlag {...props} />);
  return { container, props };
};

describe("FormGuessFlag", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the text input", () => {
    renderComponent();
    expect(screen.getByRole("textbox", { name: /country name/i })).toBeInTheDocument();
  });

  it("should render the submit button", () => {
    renderComponent();
    expect(screen.getByRole("button", { name: /submit flag guess/i })).toBeInTheDocument();
  });

  it("should call handleSetScore and handleNextFlagToGuess on a correct guess", async () => {
    const user = userEvent.setup();
    renderComponent({ secondsLeft: 30 });

    await user.type(screen.getByRole("textbox", { name: /country name/i }), mockFlag.name);
    await user.click(screen.getByRole("button", { name: /submit flag guess/i }));

    expect(mockHandleSetScore).toHaveBeenCalledWith(30 * mockMode.multiplier);
    expect(mockHandleNextFlagToGuess).toHaveBeenCalledWith([mockFlag]);
  });

  it("should not call handleSetScore on a wrong guess", async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.type(screen.getByRole("textbox", { name: /country name/i }), "wrong answer");
    await user.click(screen.getByRole("button", { name: /submit flag guess/i }));

    expect(mockHandleSetScore).not.toHaveBeenCalled();
    expect(mockHandleNextFlagToGuess).not.toHaveBeenCalled();
  });

  it("should be case-insensitive when checking the guess", async () => {
    const user = userEvent.setup();
    renderComponent({ secondsLeft: 10 });

    await user.type(
      screen.getByRole("textbox", { name: /country name/i }),
      mockFlag.name.toUpperCase()
    );
    await user.click(screen.getByRole("button", { name: /submit flag guess/i }));

    expect(mockHandleSetScore).toHaveBeenCalledTimes(1);
  });
});
