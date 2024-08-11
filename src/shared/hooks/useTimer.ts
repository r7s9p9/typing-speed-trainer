import { useEffect } from "react";
import { useStore } from "../store/StoreProvider";
import { TIMER_SECONDS_COUNT } from "../../constants";

export function useTimer({
  onTimerTimeout,
}: {
  onTimerTimeout: ReturnType<typeof Function>;
}) {
  const { store, updateStore } = useStore();
  const timer = store.timer;

  function handleTime() {
    if (timer.countdown > 0) {
      updateStore({
        timer: {
          ...store.timer,
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
    if (!timer.ref) return;
    updateStore({
      timer: {
        ref: store.timer.ref,
        isStarted: false,
        countdown: timer.countdown,
      },
    });
    timer.ref.current.style.opacity = "0";
  }

  function resetTimer() {
    if (!timer.ref) return;
    updateStore({
      timer: {
        ref: store.timer.ref,
        isStarted: false,
        countdown: TIMER_SECONDS_COUNT,
      },
    });
    timer.ref.current.style.opacity = "0";
  }

  function startTimer() {
    if (!timer.ref) return;
    updateStore({
      timer: {
        ref: store.timer.ref,
        isStarted: true,
        countdown: timer.countdown,
      },
    });
    timer.ref.current.style.opacity = "1";
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
