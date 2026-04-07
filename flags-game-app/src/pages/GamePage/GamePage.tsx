import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import type { JSX } from "react";

import Loader from "@/components/Loader/Loader";
import FlagComponent from "@/components/Flag/Flag";
import FormGuessFlag from "@/components/Forms/FormGuessFlag/FormGuessFlag";

import { useCountdown } from "@/hooks/useCountdown";
import { useFlagsContext } from "@/hooks/useFlagsContext";
import { useModeContext } from "@/hooks/useModeContext";
import { useGameContext } from "@/hooks/useGameContext";

import flagService from "@/services/flagService";
import modeService from "@/services/modeService";

import "@/pages/GamePage/GamePage.css";

const GamePage = (): JSX.Element => {
  const { idMode } = useParams();
  const navigate = useNavigate();

  const {
    flags,
    handleClearFlags,
    handleEndFetchFlags,
    handleSetErrorFlags,
    handleSetFlags,
    handleStartFetchFlags,
  } = useFlagsContext();
  const {
    mode,
    handleClearMode,
    handleEndFetchMode,
    handleSetErrorMode,
    handleSetMode,
    handleStartFetchMode,
  } = useModeContext();
  const { completeGuess, currentFlagToGuess, score, handleSetFlagToGuess } = useGameContext();

  const { timerText, secondsLeft, endTime, onCountdownReset } = useCountdown(mode.mode?.timeleft);

  const handleGetRandomFlags = async (): Promise<void> => {
    try {
      handleStartFetchFlags();
      const response = await flagService.getRandoms(5);
      handleSetFlags(response.data);
    } catch (error) {
      handleSetErrorFlags(String(error));
    } finally {
      handleEndFetchFlags();
    }
  };

  const handleGetMode = async (): Promise<void> => {
    try {
      handleStartFetchMode();
      const response = await modeService.getById(idMode!);
      handleSetMode(response.data);
    } catch (error) {
      handleSetErrorMode(String(error));
    } finally {
      handleEndFetchMode();
    }
  };

  useEffect(() => {
    void handleGetRandomFlags();
    void handleGetMode();

    return (): void => {
      onCountdownReset();
      handleClearFlags();
      handleClearMode();
    };
  }, []);

  useEffect(() => {
    if (endTime || completeGuess) void navigate(`/menu/${mode.mode?._id}/finishgame`);
  }, [endTime, completeGuess]);

  useEffect(() => {
    if (flags.flags.length === 0 || currentFlagToGuess) return;

    handleSetFlagToGuess(flags.flags[0]!);
  }, [flags.flags]);

  if (flags.loading || !currentFlagToGuess) {
    return (
      <main className="game-main">
        <Loader></Loader>
      </main>
    );
  }

  return (
    <main className="game-main">
      <section className="game-page">
        <article className="game-page__header">
          <h1 className="game-page__title">GUESS THE FLAG</h1>
          <FlagComponent
            key={currentFlagToGuess._id}
            image={currentFlagToGuess.image}
            name={currentFlagToGuess.name}
          ></FlagComponent>
        </article>

        <FormGuessFlag secondsLeft={secondsLeft}></FormGuessFlag>

        <article className="game-page__stats">
          <h3 className="game-page__score" aria-live="polite">
            Score: {score} PTS
          </h3>

          <h3 className="game-page__timeleft" aria-live="polite">
            Time left: {timerText}
          </h3>
        </article>
      </section>
    </main>
  );
};

export default GamePage;
