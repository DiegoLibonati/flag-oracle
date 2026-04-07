import { useEffect, useRef } from "react";

import type { JSX } from "react";
import type { FormGuessFlagProps } from "@/types/props";

import { useForm } from "@/hooks/useForm";
import { useGameContext } from "@/hooks/useGameContext";
import { useModeContext } from "@/hooks/useModeContext";
import { useFlagsContext } from "@/hooks/useFlagsContext";

import "@/components/Forms/FormGuessFlag/FormGuessFlag.css";

const FormGuessFlag = ({ secondsLeft }: FormGuessFlagProps): JSX.Element => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { flags } = useFlagsContext();
  const { currentFlagToGuess, score, handleSetScore, handleNextFlagToGuess } = useGameContext();
  const { mode } = useModeContext();

  const { formState, onInputChange, onResetForm } = useForm({
    name: "",
  });

  const onSubmit: React.SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const currentFlagName = currentFlagToGuess!.name.toLowerCase();
    const inputElement = inputRef.current!;
    const inputValue = formState.name.toLowerCase();

    if (currentFlagName === inputValue) {
      inputElement.style.borderColor = getComputedStyle(document.documentElement)
        .getPropertyValue("--color-green")
        .trim();
      onResetForm();
      handleSetScore(score + secondsLeft * mode.mode!.multiplier);
      handleNextFlagToGuess(flags.flags);
      return;
    }

    inputElement.style.borderColor = getComputedStyle(document.documentElement)
      .getPropertyValue("--color-red")
      .trim();
    onResetForm();
  };

  useEffect(() => {
    const inputElement = inputRef.current;

    if (!inputElement) return;

    const timeout = setTimeout(() => {
      inputRef.current!.style.borderColor = getComputedStyle(document.documentElement)
        .getPropertyValue("--color-white")
        .trim();
    }, 500);

    return (): void => {
      clearTimeout(timeout);
    };
  }, [inputRef.current?.style.borderColor]);

  return (
    <form
      className="form-guess-flag"
      onSubmit={(e) => {
        onSubmit(e);
      }}
    >
      <input
        ref={inputRef}
        type="text"
        value={formState.name}
        placeholder="Enter a Country Name..."
        onChange={(e) => {
          onInputChange(e);
        }}
        className="form-guess-flag__input"
        name="name"
      ></input>
      <button type="submit" aria-label="submit guess" className="form-guess-flag__submit">
        SUBMIT
      </button>
    </form>
  );
};

export default FormGuessFlag;
