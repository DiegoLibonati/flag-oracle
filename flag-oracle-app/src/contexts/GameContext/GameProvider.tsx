import { useState } from "react";

import type { JSX } from "react";
import type { Flag } from "@/types/app";
import type { GameProviderProps } from "@/types/props";

import { GameContext } from "@/contexts/GameContext/GameContext";

export const GameProvider = ({ children }: GameProviderProps): JSX.Element => {
  const [currentFlagToGuess, setCurrentFlagToGuess] = useState<Flag | null>(null);
  const [completeGuess, setCompleteGuess] = useState(false);
  const [score, setScore] = useState(0);

  const handleNextFlagToGuess = (flags: Flag[]): void => {
    const indexOfFlag = flags.indexOf(currentFlagToGuess!);
    const newIndexFlag = indexOfFlag + 1;

    if (newIndexFlag === flags.length) {
      setCompleteGuess(true);
      return;
    }

    setCurrentFlagToGuess(flags[newIndexFlag]!);
  };

  const handleSetFlagToGuess = (flag: Flag): void => {
    setCurrentFlagToGuess(flag);
  };

  const handleClearCurrentFlagToGuess = (): void => {
    setCurrentFlagToGuess(null);
    setCompleteGuess(false);
  };

  const handleSetScore = (score: number): void => {
    setScore(score);
  };

  return (
    <GameContext.Provider
      value={{
        currentFlagToGuess: currentFlagToGuess,
        completeGuess: completeGuess,
        score: score,
        handleNextFlagToGuess: handleNextFlagToGuess,
        handleSetScore: handleSetScore,
        handleSetFlagToGuess: handleSetFlagToGuess,
        handleClearCurrentFlagToGuess: handleClearCurrentFlagToGuess,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
