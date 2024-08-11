import { useEffect, MutableRefObject } from "react";
import { useStore } from "../store/StoreProvider";
import { TIMER_SECONDS_COUNT } from "../../constants";

export function useTimer({
  onTimerTimeout,
  timerRef,
}: {
  onTimerTimeout: ReturnType<typeof Function>;
  timerRef: MutableRefObject<HTMLDivElement>;
}) {
  const { store, updateStore } = useStore();
  const timer = store.timer;

  function handleTime() {
    if (timer.countdown > 0) {
      updateStore({
        timer: {
          isStarted: true,
          countdown: timer.countdown - 1,
        },
      });
    } else {
      stopTimer();
      onTimerTimeout();
    }
  }

  function stopTimer() {
    if (!timerRef) return;
    updateStore({
      timer: {
        isStarted: false,
        countdown: timer.countdown,
      },
    });
    timerRef.current.style.opacity = "0";
  }

  function resetTimer() {
    if (!timerRef) return;
    updateStore({
      timer: {
        isStarted: false,
        countdown: TIMER_SECONDS_COUNT,
      },
    });
    timerRef.current.style.opacity = "0";
  }

  function startTimer() {
    if (!timerRef) return;
    updateStore({
      timer: {
        isStarted: true,
        countdown: timer.countdown,
      },
    });
    timerRef.current.style.opacity = "1";
  }

  useEffect(() => {
    if (timer.isStarted) {
      const interval = setInterval(() => handleTime(), 1000);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer]);

  return {
    startTimer,
    stopTimer,
    resetTimer,
  };
}
