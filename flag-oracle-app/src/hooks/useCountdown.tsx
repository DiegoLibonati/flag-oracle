import { useState, useEffect, useRef } from "react";

import type { UseCountdown } from "@/types/hooks";

import { parseZero } from "@/helpers/parseZero";

export const useCountdown = (timeleft: number | undefined): UseCountdown => {
  const [secondsLeft, setSecondsLeft] = useState(-1);
  const [timerText, setTimerText] = useState("00:00:00");
  const [endTime, setEndTime] = useState(false);

  const timerRef = useRef<number | null>(null);

  const restASecond = (): (() => void) => {
    timerRef.current = setTimeout(() => {
      const newSecondsLeft = secondsLeft - 1;
      setSecondsLeft(newSecondsLeft);
      secondsToTimer(newSecondsLeft);

      if (!newSecondsLeft) setEndTime(true);
    }, 1000);

    return () => {
      clearTimeout(timerRef.current!);
    };
  };

  const secondsToTimer = (seconds: number): void => {
    const hours = parseZero(Math.floor(seconds / 3600));
    const minutes = parseZero(Math.floor((seconds % 3600) / 60));
    const secs = parseZero(seconds % 60);

    setSecondsLeft(seconds);
    setTimerText(`${hours}:${minutes}:${secs}`);
  };

  const onCountdownReset = (): void => {
    setTimerText("");
    clearTimeout(timerRef.current!);
    timerRef.current = null;
  };

  useEffect(() => {
    if (!timeleft) return;

    secondsToTimer(timeleft);
  }, [timeleft]);

  useEffect(() => {
    if (secondsLeft === -1) return;

    return restASecond();
  }, [secondsLeft]);

  return {
    timerText: timerText,
    secondsLeft: secondsLeft,
    endTime: endTime,
    onCountdownReset: onCountdownReset,
  };
};
