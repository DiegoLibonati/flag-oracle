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
  const { completeGuess, currentFlagToGuess, score, handleSetFlagToGuess, handleSetScore } =
    useGameContext();

  const { timerText, secondsLeft, endTime, onCountdownReset } = useCountdown(mode.mode?.timeleft);

  const handleGetRandomFlags = async (signal: AbortSignal): Promise<void> => {
    try {
      handleStartFetchFlags();
      const response = await flagService.getRandoms(5, signal);
      if (signal.aborted) return;
      handleSetFlags(response.data);
    } catch (error) {
      if (signal.aborted) return;
      handleSetErrorFlags(String(error));
    } finally {
      if (!signal.aborted) handleEndFetchFlags();
    }
  };

  const handleGetMode = async (signal: AbortSignal): Promise<void> => {
    try {
      handleStartFetchMode();
      const response = await modeService.getById(idMode!, signal);
      if (signal.aborted) return;
      handleSetMode(response.data);
    } catch (error) {
      if (signal.aborted) return;
      handleSetErrorMode(String(error));
    } finally {
      if (!signal.aborted) handleEndFetchMode();
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    handleSetScore(0);
    void handleGetRandomFlags(controller.signal);
    void handleGetMode(controller.signal);

    return (): void => {
      controller.abort();
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
