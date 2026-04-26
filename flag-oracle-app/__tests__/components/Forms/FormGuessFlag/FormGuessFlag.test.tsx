import { useEffect } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { JSX, ReactNode } from "react";
import type { RenderResult } from "@testing-library/react";

import FormGuessFlag from "@/components/Forms/FormGuessFlag/FormGuessFlag";

import { FlagsProvider } from "@/contexts/FlagsContext/FlagsProvider";
import { GameProvider } from "@/contexts/GameContext/GameProvider";
import { ModeProvider } from "@/contexts/ModeContext/ModeProvider";

import { useFlagsContext } from "@/hooks/useFlagsContext";
import { useGameContext } from "@/hooks/useGameContext";
import { useModeContext } from "@/hooks/useModeContext";

import { mockFlags, mockFlag } from "@tests/__mocks__/flags.mock";
import { mockMode } from "@tests/__mocks__/modes.mock";

const StateSetup = ({ children }: { children: ReactNode }): JSX.Element => {
  const { handleSetFlags } = useFlagsContext();
  const { handleSetFlagToGuess } = useGameContext();
  const { handleSetMode } = useModeContext();

  useEffect(() => {
    handleSetFlags(mockFlags);
    handleSetFlagToGuess(mockFlag);
    handleSetMode(mockMode);
  }, []);

  return <>{children}</>;
};

const renderComponent = (secondsLeft = 30): RenderResult => {
  return render(
    <FlagsProvider>
      <ModeProvider>
        <GameProvider>
          <StateSetup>
            <FormGuessFlag secondsLeft={secondsLeft} />
          </StateSetup>
        </GameProvider>
      </ModeProvider>
    </FlagsProvider>
  );
};

const renderWithoutState = (secondsLeft = 0): RenderResult => {
  return render(
    <FlagsProvider>
      <ModeProvider>
        <GameProvider>
          <FormGuessFlag secondsLeft={secondsLeft} />
        </GameProvider>
      </ModeProvider>
    </FlagsProvider>
  );
};

describe("FormGuessFlag", () => {
  describe("rendering", () => {
    it("should render the country name input", () => {
      renderWithoutState();
      expect(screen.getByRole("textbox", { name: "Country name" })).toBeInTheDocument();
    });

    it("should render the submit button", () => {
      renderWithoutState();
      expect(screen.getByRole("button", { name: "Submit flag guess" })).toBeInTheDocument();
    });

    it("should render input with correct placeholder", () => {
      renderWithoutState();
      expect(screen.getByPlaceholderText("Enter a Country Name...")).toBeInTheDocument();
    });

    it("should render input with empty initial value", () => {
      renderWithoutState();
      expect(screen.getByRole("textbox", { name: "Country name" })).toHaveValue("");
    });
  });

  describe("behavior", () => {
    it("should update input value when user types", async () => {
      renderWithoutState();
      const user = userEvent.setup();
      const input = screen.getByRole("textbox", { name: "Country name" });
      await user.type(input, "Colombia");
      expect(input).toHaveValue("Colombia");
    });

    it("should reset input after submitting a correct answer", async () => {
      renderComponent();
      const user = userEvent.setup();
      const input = screen.getByRole("textbox", { name: "Country name" });
      await user.type(input, mockFlag.name);
      await user.click(screen.getByRole("button", { name: "Submit flag guess" }));
      await waitFor(() => {
        expect(input).toHaveValue("");
      });
    });

    it("should reset input after submitting a wrong answer", async () => {
      renderComponent();
      const user = userEvent.setup();
      const input = screen.getByRole("textbox", { name: "Country name" });
      await user.type(input, "Wrong Country Name");
      await user.click(screen.getByRole("button", { name: "Submit flag guess" }));
      await waitFor(() => {
        expect(input).toHaveValue("");
      });
    });

    it("should accept case-insensitive correct answers", async () => {
      renderComponent();
      const user = userEvent.setup();
      const input = screen.getByRole("textbox", { name: "Country name" });
      await user.type(input, mockFlag.name.toUpperCase());
      await user.click(screen.getByRole("button", { name: "Submit flag guess" }));
      await waitFor(() => {
        expect(input).toHaveValue("");
      });
    });
  });
});
