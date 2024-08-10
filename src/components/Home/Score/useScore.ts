import {
  routes,
  TIMER_SECONDS_COUNT,
  CALC_WORD_LENGTH,
  CALC_MINUTE,
} from "../../../constants";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../../shared/store/StoreProvider";
import { useOnClickOutside } from "../../../shared/hooks/useOnClickOutside";
import { formatNumber } from "../../../shared/lib/number";

export function useScore() {
  const navigate = useNavigate();
  const { store } = useStore();

  const time = TIMER_SECONDS_COUNT - store.timer.countdown;
  const accuracy = formatNumber((store.count.correct / store.count.all) * 100);
  const minutes = time / CALC_MINUTE;
  const wpm = formatNumber(store.count.correct / CALC_WORD_LENGTH / minutes);

  const onClose = () => {
    navigate(routes.home.path);
    return;
  };

  const { contentRef, overlayRef } = useOnClickOutside({
    onClickOutside: onClose,
  });

  return {
    score: { time, accuracy, wpm },
    contentRef,
    overlayRef,
    onClose,
  };
}
