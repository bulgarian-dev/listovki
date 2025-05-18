import { useState, useEffect } from "react";
import { formatTime } from "@/lib/formatters";

export function useQuizTimer(isActive: boolean = false) {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(isActive);

  useEffect(() => {
    setIsRunning(isActive);
  }, [isActive]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = () => {
    setIsRunning(false);
    setSeconds(0);
  };

  const formattedTime = formatTime(seconds);

  return {
    seconds,
    formattedTime,
    isRunning,
    start,
    pause,
    reset,
  };
}
